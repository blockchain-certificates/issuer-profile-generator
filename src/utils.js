function expectedAnswer (answer, expected) {
  return answer.toLowerCase() === expected.toLowerCase() || answer.toLowerCase()[0] === expected[0].toLowerCase();
}

module.exports = {
  expectedAnswer
};
