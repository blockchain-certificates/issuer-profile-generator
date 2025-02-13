const readline = require('readline');
const generateIssuerProfile = require('../src/generateIssuerProfile');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const questions = [
  { key: 'id', question: 'Enter the web address where the issuer file will be hosted (full path to file): ' },
  { key: 'name', question: 'Enter the name of the organization: ' },
  { key: 'email', question: 'Enter a contact email address: ' },
  { key: 'image', question: 'Enter the base64 image as logo: ' }
];

let answers = {};

const askQuestion = (index) => {
  if (index < questions.length) {
    const { question, key } = questions[index];
    rl.question(question, (answer) => {
      if (key === 'id') {
        const urlObject = new URL(answer);
        answers.url = urlObject.origin;
      }
      answers[key] = answer;
      askQuestion(index + 1);
    });
  } else {
    rl.close();
    const issuerProfile = generateIssuerProfile(answers);
    const jsonData = JSON.stringify(issuerProfile, null, 4);
    console.log('Created Issuer Profile:');
    console.log(jsonData);
  }
};

askQuestion(0);
