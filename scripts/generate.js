const generateIssuerProfile = require('../src/generateIssuerProfile');
const validateEmail = require('../src/validators/email');
const { expectedAnswer } = require('../src/utils/expectedAnswer');
const handleKeyGeneration = require('../src/keyGenerators/handleKeyGeneration');
const sanitizeVerificationMethod = require('../src/keyGenerators/utils/sanitizeVerificationMethod');
const Ed25519Signer = require('../src/signers/Ed25519');
const log = require('../src/utils/log');
const { prompt, closeRl } = require('../src/prompt');

const questions = [
  { key: 'id', question: 'Enter the web address where the issuer file will be hosted (full path to file): ' },
  { key: 'name', question: 'Enter the name of the organization: ' },
  { key: 'email', question: 'Enter a contact email address: ' },
  { key: 'image', question: 'Enter the base64 image as logo: ' },
  { key: 'verificationMethod', question: 'Do you want to add a verification method? (y)es/(n)o: '}
];

let answers = {};

async function askPurpose (method) {
  const purpose = await prompt('Select the purpose of the verification method: ' +
    '(a)ssertion (default), aut(h)entication, capability (d)elegation, capability (i)nvocation ');
  if (expectedAnswer(purpose, 'assertion') || purpose === '') {
    if (!answers.assertionMethod) {
      answers.assertionMethod = [];
    }
    answers.assertionMethod.push(method.id);
  }

  if (expectedAnswer(purpose, 'authentication', 'h')) {
    if (!answers.authentication) {
      answers.authentication = [];
    }
    answers.authentication.push(method.id);
  }

  if (expectedAnswer(purpose, 'capability delegation', 'd')) {
    if (!answers.capabilityDelegation) {
      answers.capabilityDelegation = [];
    }
    answers.capabilityDelegation.push(method.id);
  }

  if (expectedAnswer(purpose, 'capability invocation', 'i')) {
    if (!answers.capabilityInvocation) {
      answers.capabilityInvocation = [];
    }
    answers.capabilityInvocation.push(method.id);
  }
}

async function askVerificationMethod (rootQuestion, currentIndex) {
  const answer = await prompt(rootQuestion);
  let specifiedMethod;
  if (expectedAnswer(answer, 'yes')) {
    const method = await prompt('Do you want to add a verification method you own or generate one? (o)wn/(g)enerate: ');
    if (expectedAnswer(method, 'own')) {
      const methodOrMnemomic = await prompt('Enter your mnemonic phrase for the key or the verification method as JSON ' +
        '(please minify it: remove line breaks and whitespaces): ');

      if (methodOrMnemomic.startsWith('{')) {
        specifiedMethod = JSON.parse(methodOrMnemomic); // TODO: add verification method validation
      } else {
        const cryptographicScheme =
          await prompt(`Select the type of keys you want to add: 
        - (M)erkleProof2019
        - E(d)25519Signature2020\n`
          ); // EcdsaSd2023, EcdsaSecp256k1Signature2019

        specifiedMethod = await handleKeyGeneration(cryptographicScheme, prompt, answers.id, methodOrMnemomic);
      }
    } else if (expectedAnswer(method, 'generate')) {
      const cryptographicScheme =
        await prompt(`Select the type of keys you want to generate: 
        - (M)erkleProof2019
        - E(d)25519Signature2020\n`
        ); // EcdsaSd2023, EcdsaSecp256k1Signature2019

      specifiedMethod = await handleKeyGeneration(cryptographicScheme, prompt, answers.id);
    } else {
      console.log('Invalid option. Please enter "own/o" or "generate/g".');
    }

    console.log(`Generated method:`, specifiedMethod);
    answers.verificationMethod.push(sanitizeVerificationMethod(specifiedMethod));
    log.spacer();

    if (specifiedMethod.address) {
      if (!answers.publicKey) {
        answers.publicKey = [];
      }
      answers.publicKey.push({
        id: 'ecdsa-koblitz-pubkey:' + specifiedMethod.address,
        created: new Date().toISOString()
      });
    }

    await askPurpose(specifiedMethod);
    askVerificationMethod(rootQuestion);
  } else if (expectedAnswer(answer, 'no') || answer === '') {
    askQuestion(currentIndex + 1);
  } else {
    console.log('Invalid option. Please enter "yes/y" or "no/n".');
    askVerificationMethod(rootQuestion);
  }
}

async function handleSaveFile (jsonData) {
  const toSave = await prompt('Do you want to save the issuer profile to a file? (y)es/(n)o. ' +
    'Default is no and the document will be output in the console: ');
  let documentIsSigned = !!jsonData.proof;

  const documentCreated = JSON.stringify(jsonData, null, 2);

  if (expectedAnswer(toSave, 'no') || toSave === '') {
    console.log('Created Issuer Profile:');
    console.log(documentCreated);
  } else if (expectedAnswer(toSave, 'yes')) {
    let fileName = await prompt('Enter the name of the file to save the issuer profile (default: issuer-profile-{name}-{date).jsom: ');
    if (fileName === '') {
      fileName = `issuer-profile-${answers.name ? answers.name.toLowerCase() : 'issuer'}-${Date.now()}.json`;
    }

    const fs = require('fs');
    const path = `./output/${documentIsSigned ? 'signed' : 'unsigned'}/`;
    fs.writeFileSync(path + fileName, documentCreated);
    log.green('File saved to ' + path + fileName);
  }
}

async function handleSignDocument (jsonData) {
  const toSign = await prompt('Do you want to sign the issuer profile? (y)es/(n)o: ');
  if (expectedAnswer(toSign, 'no') || toSign === '') {
    return jsonData;
  } else if (expectedAnswer(toSign, 'yes')) {
    const signingSuite = await prompt('Select the signing suite: (M)erkleProof2019, E(d)25519Signature2020: ');
    if (expectedAnswer(signingSuite, 'merkleproof2019')) {
      log.yellow(' /!\  Please use blockcerts\' cert-issuer python package to sign the document.')
      return jsonData;
    }

    if (expectedAnswer(signingSuite, 'ed25519signature2020', 'd')) {
      const privateKey = await prompt('Enter the privateKey (multibase) to sign the document: '); // TODO: sign with seed?
      const publicKey = await prompt('Enter the publicKey (multibase) to sign the document: ');
      const signed = await Ed25519Signer(privateKey, publicKey, jsonData);
      console.log(signed);
      return signed;
    }
  }
}

async function askQuestion (index) {
  if (index < questions.length) {
    const { question, key } = questions[index];
    if (key === 'verificationMethod') {
      answers.verificationMethod = [];
      await askVerificationMethod(question, index);
    } else {
      const answer = await prompt(question);
      if (key === 'id') {
        const urlObject = new URL(answer); // also does validation
        answers.url = urlObject.origin;
      }

      if (key === 'email' && answer !== '') {
        validateEmail(answer);
      }

      answers[key] = answer;
      askQuestion(index + 1);
    }
  } else {
    const issuerProfile = generateIssuerProfile(answers);
    const signedDocument = await handleSignDocument(issuerProfile);
    await handleSaveFile(signedDocument);
    closeRl();
  }
}

askQuestion(0);
