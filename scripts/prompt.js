const generateIssuerProfile = require('../src/generateIssuerProfile');
const validateEmail = require('../src/validators/email');
const generateMerkleProof2019 = require('../src/keyGenerators/MerkleProof2019');
const { expectedAnswer } = require('../src/utils/utils');
const readline = require('node:readline/promises');
const { stdin: input, stdout: output } = require('node:process');
const rl = readline.createInterface({ input, output });

const questions = [
  { key: 'id', question: 'Enter the web address where the issuer file will be hosted (full path to file): ' },
  { key: 'name', question: 'Enter the name of the organization: ' },
  { key: 'email', question: 'Enter a contact email address: ' },
  { key: 'image', question: 'Enter the base64 image as logo: ' },
  { key: 'verificationMethod', question: 'Do you want to add a verification method? (y)es/(n)o: '}
];

let answers = {};

const cryptographicSchemes = {
  MerkleProof2019: generateMerkleProof2019
}

async function prompt (question) {
  return await rl.question(question, answer => resolve(answer.trim()));
}

async function askVerificationMethod (rootQuestion, currentIndex) {
  const answer = await prompt(rootQuestion);
  if (expectedAnswer(answer, 'yes')) {
    const method = await prompt('Do you want to add a verification method you own or generate one? (o)wn/(g)enerate: ');
    if (expectedAnswer(method, 'own')) {
      prompt('Enter your verification method: ', (method) => {
        answers.verificationMethod.push(method);
      });
    } else if (expectedAnswer(method, 'generate')) {
      let generatedMethod;
      const cryptographicScheme =
        await prompt(`Select the type of keys you want to generate: 
        - (M)erkleProof2019\n`); // EcdsaSd2023, EcdsaSecp256k1Signature2019, Ed25519Signature2020

      if (expectedAnswer(cryptographicScheme, 'MerkleProof2019')) {
        generatedMethod = await cryptographicSchemes.MerkleProof2019(prompt, answers.id);

        if (generatedMethod.address) {
          if (!answers.publicKey) {
            answers.publicKey = [];
          }
          answers.publicKey.push({
            id: 'ecdsa-koblitz-pubkey:' + generatedMethod.address,
            created: new Date().toISOString()
          })
        }
      }

      console.log(`Generated method:`, generatedMethod);
      answers.verificationMethod.push(generatedMethod);
    } else {
      console.log('Invalid option. Please enter "own/o" or "generate/g".');
    }
    askVerificationMethod(rootQuestion);
  } else if (expectedAnswer(answer, 'no') || answer === '') {
    askQuestion(currentIndex + 1);
  } else {
    console.log('Invalid option. Please enter "yes/y" or "no/n".');
    askVerificationMethod(rootQuestion);
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
    rl.close();
    const issuerProfile = generateIssuerProfile(answers);
    const jsonData = JSON.stringify(issuerProfile, null, 4);
    console.log('Created Issuer Profile:');
    console.log(jsonData);
  }
}

askQuestion(0);
