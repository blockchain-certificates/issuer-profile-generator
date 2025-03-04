const { prompt, closeRl } = require('../src/prompt');
const { expectedAnswer } = require('../src/utils/expectedAnswer');

async function sign () {
  const location = await prompt(
'Do you want to sign a local file, a remote file or a JSON object? ' +
    '(l)ocal/(r)emote/(j)son: ');

  let document;

  if (expectedAnswer(location, 'local')) {
    const file = await prompt('Enter the (absolute) path to the file you want to sign: ');
    document = require(file);
  } else if (expectedAnswer(location, 'remote')) {
    const url = await prompt('Enter the URL of the file you want to sign: ');
    const file = await fetch(url);
    document = await file.json();
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


  closeRl();
}

sign();
