const bip39 = require('bip39');
const log = require('../../utils/log');

function generateSeed () {
  const mnemonic = bip39.generateMnemonic();
  log.spacer();
  console.warn('mnenomic phrase generated (store it safely!):');
  log.red(mnemonic);
  log.spacer();
  const seed = bip39.mnemonicToSeedSync(mnemonic);

  // console.log('seed generated', seed, seed.length, seed.toString('hex'), seed.toString('hex').length);

  return seed;
}

module.exports = generateSeed;
