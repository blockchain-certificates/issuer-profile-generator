const generateIssuerProfile = require('../src/generateIssuerProfile');
const validateEmail = require('../src/validators/email');
const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');
const rl = readline.createInterface({ input, output });

const questions = [
  { key: 'id', question: 'Enter the web address where the issuer file will be hosted (full path to file): ' },
  { key: 'name', question: 'Enter the name of the organization: ' },
  { key: 'email', question: 'Enter a contact email address: ' },
  { key: 'image', question: 'Enter the base64 image as logo: ' },
  { key: 'verificationMethod', question: 'Do you want to add a verification method? (yes/no): '}
];

let answers = {};

const askVerificationMethod = (rootQuestion, currentIndex) => {
  rl.question(rootQuestion, (answer) => {
    if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
      rl.question('Do you want to add a verification method you own or generate one? (own/generate): ', (methodType) => {
        if (methodType.toLowerCase() === 'own' || methodType.toLowerCase() === 'o') {
          rl.question('Enter your verification method: ', (method) => {
            answers.verificationMethod.push(method);
          });
        } else if (methodType.toLowerCase() === 'generate' || methodType.toLowerCase() === 'g') {
          const generatedMethod = `generated-method-${Date.now()}`;
          console.log(`Generated method: ${generatedMethod}`);
          answers.verificationMethod.push(generatedMethod);
        } else {
          console.log('Invalid option. Please enter "own" or "generate".');
        }
        askVerificationMethod(rootQuestion);
      });
    } else if (answer.toLowerCase() === 'no' || answer.toLowerCase() === 'n') {
      askQuestion(currentIndex + 1);
    } else {
      console.log('Invalid option. Please enter "yes" or "no".');
      askVerificationMethod(rootQuestion);
    }
  });
};

const askQuestion = (index) => {
  if (index < questions.length) {
    const { question, key } = questions[index];
    if (key === 'verificationMethod') {
      answers.verificationMethod = [];
      askVerificationMethod(question, index);
    } else {
      rl.question(question, (answer) => {
        if (key === 'id') {
          const urlObject = new URL(answer); // also does validation
          answers.url = urlObject.origin;
        }

        if (key === 'email' && answer !== '') {
          validateEmail(answer);
        }

        answers[key] = answer;
        askQuestion(index + 1);
      });
    }
  } else {
    rl.close();
    const issuerProfile = generateIssuerProfile(answers);
    const jsonData = JSON.stringify(issuerProfile, null, 4);
    console.log('Created Issuer Profile:');
    console.log(jsonData);
  }
};

askQuestion(0);
