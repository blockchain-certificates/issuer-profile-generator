const { prompt, closeRl } = require('../src/prompt');
const { expectedAnswer } = require('../src/utils/expectedAnswer');
const Ed25519Signer = require('../src/signers/Ed25519');
const sanitizeVerificationMethod = require('../src/keyGenerators/utils/sanitizeVerificationMethod');
const fs = require("fs");
const log = require("../src/utils/log");

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
  console.log('document', document);
  return document;
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
    console.log('verificationMethod added to the document', sanitizeVerificationMethod(verificationMethod));
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

async function sign () {
  const document = await loadDocument();

  const signingKey = await loadSigningKeyPair(document);

  const signedDocument = await Ed25519Signer(signingKey.privateKeyMultibase, signingKey.publicKeyMultibase, document);

  console.log('Signed document\'s proof:', signedDocument.proof);

  await handleSaveFile(signedDocument);

  closeRl();
}

sign();
