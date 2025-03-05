const readline = require('node:readline/promises');
const { stdin: input, stdout: output } = require('node:process');
const rl = readline.createInterface({ input, output });

async function prompt (question) {
  return await rl.question(question, answer => resolve(answer.trim()));
}

function closeRl () {
  rl.close();
}

module.exports = {
  prompt,
  closeRl
}
