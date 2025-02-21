const bip39 = require('bip39');
const log = require('../../utils/log');

function generateSeed (mnemonic = bip39.generateMnemonic()) {
  log.spacer();
  console.warn('mnenomic phrase generated (store it safely!):');
  log.red(mnemonic);
  log.spacer();

  return bip39.mnemonicToSeedSync(mnemonic);
}

module.exports = generateSeed;
