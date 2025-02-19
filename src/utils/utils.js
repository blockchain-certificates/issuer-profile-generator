function expectedAnswer (answer, expected, shorthand = '') {
  if (shorthand === '') {
    shorthand = expected[0]; // first character of expected answer
  }
  return answer.toLowerCase() === expected.toLowerCase() || answer.toLowerCase()[0] === shorthand.toLowerCase();
}

module.exports = {
  expectedAnswer
};
