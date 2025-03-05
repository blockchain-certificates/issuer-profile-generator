const { prompt, closeRl } = require('../src/prompt');
const { expectedAnswer } = require('../src/utils/expectedAnswer');
const Ed25519Signer = require('../src/signers/Ed25519');
const sanitizeVerificationMethod = require('../src/keyGenerators/utils/sanitizeVerificationMethod');
const fs = require("fs");
const log = require("../src/utils/log");
const loadContextUrls = require("../src/contexts/contextUrls");

let fileName;

async function loadDocument () {
  const location = await prompt(
    'Do you want to sign a local file, a remote file or a JSON object? ' +
    '(l)ocal/(r)emote/(j)son: ');

  let document;

  if (expectedAnswer(location, 'local')) {
    const filePath = await prompt('Enter the (absolute) path to the file you want to sign: ');
    document = require(filePath);
    fileName = filePath.split('/').pop();
  } else if (expectedAnswer(location, 'remote')) {
    const url = await prompt('Enter the URL of the file you want to sign: ');
    const file = await fetch(url);
    document = await file.json();
    fileName = url.split('/').pop();
  } else if (expectedAnswer(location, 'json')) {
    const data = await prompt(
      'Enter the JSON object you want to sign ' +
      '(please minify it (remove line breaks and white spaces)): ');
    document = JSON.parse(data);
  } else {
    console.log('Invalid input. Please try again.');
    return sign();
  }

  document = await modernizeDocument(document);
  console.log('Updated document ready for signature: ', document);

  const userApprovedDocument = await prompt(
    'Do you want to proceed with this document? (y)es/(n)o: ');

  if (expectedAnswer(userApprovedDocument, 'yes') || userApprovedDocument === '') {
    return document;
  } else {
    sign();
  }
}

async function loadSigningKeyPair (document) {
  const keyLocation = await prompt(
    'Do you want to sign with an Ed25519 existing key or generate a new one? ' +
    '(e)xisting/(g)enerate: ');

  if (expectedAnswer(keyLocation, 'existing')) {
    const privateKeyMultibase = await prompt('Enter the privateKey (multibase) to sign the document: '); // TODO: sign with seed?
    const publicKeyMultibase = await prompt('Enter the publicKey (multibase) to sign the document: ');
    const controller = await prompt('Enter the controller document ID for this key: ');
    return {
      privateKeyMultibase,
      publicKeyMultibase,
      controller
    };
  } else if (expectedAnswer(keyLocation, 'generate')) {
    const generateEd25519 = require('../src/keyGenerators/Ed25519');
    const verificationMethod = await generateEd25519(prompt, document.id);
    document.verificationMethod.push(sanitizeVerificationMethod(verificationMethod));
    document.assertionMethod.push(verificationMethod.id);
    log.yellow('verificationMethod added to the document', sanitizeVerificationMethod(verificationMethod));
    return verificationMethod;
  }
}

async function handleSaveFile (signedDocument) {
  let changeName = false;
  if (fileName) {
    const toChange = await prompt(
      `File will be saved as ${fileName}. Do you want to change the name? (y)es/(n)o: `);

    if (expectedAnswer(toChange, 'yes')) {
      changeName = true;
    }
  }

  if (!fileName || changeName) {
    fileName = await prompt('Enter the name of the file: ');
  }

  const path = `./output/signed/`;
  fs.writeFileSync(path + fileName, JSON.stringify(signedDocument));
  log.green('File saved to ' + path + fileName);
}

async function modernizeDocument (document) {
  const contextUrls = await loadContextUrls();
  if (document['@context'].includes(contextUrls.DID_V1_CONTEXT)) {
    const toChange = await prompt(
      'Found a DID context in the document. ' +
      'Blockcerts Issuer Profile works better with Controller ID context (CID). ' +
      'Do you want to change it? (y)es (RECOMMENDED)/(n)o: '
    );
    if (expectedAnswer(toChange, 'yes') || toChange === '') {
      const entryIndex = document['@context'].indexOf(contextUrls.DID_V1_CONTEXT);
      document['@context'][entryIndex] = contextUrls.CID_V1_CONTEXT;
      log.yellow('Changed DID context to CID context');
    }
  }

  if (document['@context'].includes(contextUrls.OPEN_BADGES_V2_CANONICAL_CONTEXT)) {
    const toChange = await prompt(
      'Found an Open Badges context in the document. ' +
      'Blockcerts Issuer Profile works better with Verifiable Credentials v2 context. ' +
      'Do you want to change it? (y)es (RECOMMENDED)/(n)o: '
    );
    if (expectedAnswer(toChange, 'yes') || toChange === '') {
      const entryIndex = document['@context'].indexOf(contextUrls.OPEN_BADGES_V2_CANONICAL_CONTEXT);
      document['@context'][entryIndex] = contextUrls.VERIFIABLE_CREDENTIAL_V2_CONTEXT;
      log.yellow('Changed Open Badges context to VC context');
    }
  }

  if (!document['@context'].includes(contextUrls.BLOCKCERTS_V3_2_CANONICAL_CONTEXT)) {
    const toChange = await prompt(
      'Blockcerts Issuer Profile works better with Blockcerts v3.2 context. ' +
      'Do you want to update it? (y)es (RECOMMENDED)/(n)o: '
    );
    if (expectedAnswer(toChange, 'yes') || toChange === '') {
      const entryIndex = document['@context'].findIndex(context => context.includes('blockcerts'));
      document['@context'][entryIndex] = contextUrls.BLOCKCERTS_V3_2_CANONICAL_CONTEXT;
      log.yellow('Changed Blockcerts context to Blockcerts v3.2 context');
    }
  }

  if (!Array.isArray(document.type)) {
    document.type = [document.type];
    log.yellow('Updated document type to an array.');
  }

  if (document.type.includes('Profile')) {
    const entryIndex = document.type.findIndex(type => type === 'Profile');
    document.type[entryIndex] = 'BlockcertsIssuerProfile';
    log.yellow('Replaced document type to BlockcertsIssuerProfile.');
  } else if (!document.type.includes['BlockcertsIssuerProfile']) {
    document.type.push('BlockcertsIssuerProfile');
    log.yellow('Added BlockcertsIssuerProfile to document type');
  }

  document.verificationMethod.forEach(verificationMethod => {
    if (verificationMethod.publicKeyJwk && verificationMethod.type !== 'JsonWebKey') {
      verificationMethod.type = 'JsonWebKey';
      log.yellow(`Updated verificationMethod ${verificationMethod.id} type to ${verificationMethod.type}`);
    }
  });

  return document;
}

async function sign () {
  const document = await loadDocument();

  const signingKey = await loadSigningKeyPair(document);

  const signedDocument = await Ed25519Signer(signingKey.privateKeyMultibase, signingKey.publicKeyMultibase, document);

  console.log('Signed document\'s proof:', signedDocument.proof);

  await handleSaveFile(signedDocument);

  closeRl();
}

sign();
