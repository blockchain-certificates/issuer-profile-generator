const { expectedAnswer } = require('../../utils/utils');
const generateKeyPairAndAddress = require('./generateKeyPairAndAddress');

const questions = [
  {
    question: 'Which blockchain are you using? (B)TC/(E)TH: ',
    key: 'blockchain'
  },
  {
    question: 'Which network are you using? (M)ainnet/(T)estnet: ',
    key: 'network'
  }
];

const answers = {};
let generatedVerificationMethod;

async function askQuestion (prompt, index) {
  if (index < questions.length) {
    const { question, key } = questions[index];
    const answer = await prompt(question);
    if (expectedAnswer(answer, 'btc')) {
      answers[key] = 'bitcoin';
    }
    if (expectedAnswer(answer, 'eth')) {
      answers[key] = 'ethereum';
    }
    if (expectedAnswer(answer, 'mainnet')) {
      answers[key] = 'mainnet';
    }
    if (expectedAnswer(answer, 'testnet')) {
      answers[key] = 'testnet';
    }
    if (index + 1 === questions.length) {
      return;
    } else {
      await askQuestion(prompt,index + 1);
    }
  } else {
    console.log('answers', answers);
  }
}

async function generateMerkleProof2019VerificationMethod (prompt, controller, seed) {
  console.log('Generating keys for a MerkleProof2019...');
  await askQuestion(prompt, 0);
  if (seed) {
    generatedVerificationMethod = await generateKeyPairAndAddress(seed);
  } else {
    generatedVerificationMethod = await generateKeyPairAndAddress(answers.blockchain, answers.network);
  }
  const id = controller + '#' + generatedVerificationMethod.address;
  generatedVerificationMethod.id = id;
  generatedVerificationMethod.controller = controller;
  generatedVerificationMethod.type = 'EcdsaSecp256k1VerificationKey2019';
  return generatedVerificationMethod;
}

module.exports = generateMerkleProof2019VerificationMethod;
