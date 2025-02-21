const {expectedAnswer} = require("../utils/utils");
const generateMerkleProof2019 = require("./MerkleProof2019");
const generateEd25519 = require("./Ed25519");

const cryptographicSchemes = {
  MerkleProof2019: generateMerkleProof2019,
  Ed25519: generateEd25519
}

async function handleKeyGeneration (cryptographicScheme, prompt, controller, mnemonicSeed = '') {
  let generatedMethod;
  if (expectedAnswer(cryptographicScheme, 'MerkleProof2019')) {
    generatedMethod = await cryptographicSchemes.MerkleProof2019(prompt, controller, mnemonicSeed);
  }

  if (expectedAnswer(cryptographicScheme, 'Ed25519Signature2020', 'd')) {
    generatedMethod = await cryptographicSchemes.Ed25519(prompt, controller, mnemonicSeed);
  }

  return generatedMethod;
}

module.exports = handleKeyGeneration;
