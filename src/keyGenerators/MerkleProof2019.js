const { expectedAnswer } = require('../utils');

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
      if (answers.blockchain === 'bitcoin') {
        answers[key] = answers.blockchain; // align with bitcoin-js network names
      }
    }
    if (expectedAnswer(answer, 'testnet')) {
      answers[key] = 'testnet';
    }
    if (index + 1 === questions.length) {
      if (answers.blockchain === 'bitcoin') {
        const generateFromBip32 = require('./blockchain/btc');
        const keyPair = generateFromBip32(answers.network);
        console.log('Generated key pair:', keyPair);
      }
    } else {
      await askQuestion(prompt,index + 1);
    }
  } else {
    console.log('answers', answers);
  }
}

async function generateMerkleProof2019 (prompt) {
  console.log('Generating keys for a MerkleProof2019...');
  await askQuestion(prompt, 0);
}

module.exports = generateMerkleProof2019;
