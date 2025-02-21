const generateSeed = require('../utils/generateSeed');

async function generateEd25519VerificationMethod (prompt, controller, mnemonicSeed = '') {
  const seed = generateSeed(mnemonicSeed);
  const seed32Bytes = seed.slice(0, 32);
  const seed32Array = new Uint8Array(seed32Bytes);
  const { Ed25519VerificationKey2020 } = await import('@digitalbazaar/ed25519-verification-key-2020');
  const keyPair = await Ed25519VerificationKey2020.generate({
    seed: seed32Array,
    controller
  });
  // console.log('ed25519 keyPair', keyPair);
  return keyPair;
}

module.exports = generateEd25519VerificationMethod;
