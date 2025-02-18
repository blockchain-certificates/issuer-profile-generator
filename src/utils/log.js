/*
ANSI color codes
Text colors:
    Black: 30
    Red: 31
    Green: 32
    Yellow: 33
    Blue: 34
    Magenta: 35
    Cyan: 36
    White: 37

Background colors:
    Black: 40
    Red: 41
    Green: 42
    Yellow: 43
    Blue: 44
    Magenta: 45
    Cyan: 46
    White: 47
 */

const log = {
  spacer: () => console.log('\n\n'),
  blue: (msg) => console.log(`\x1b[34m ${msg} \x1b[0m`),
  green: (msg) => console.log(`\x1b[32m ${msg} \x1b[0m`),
  red: (msg) => console.log(`\x1b[31m ${msg} \x1b[0m`),
  yellow: (msg) => console.log(`\x1b[33m ${msg} \x1b[0m`),
  cyan: (msg) => console.log(`\x1b[36m ${msg} \x1b[0m`),
  magenta: (msg) => console.log(`\x1b[35m ${msg} \x1b[0m`)
}

module.exports = log;
