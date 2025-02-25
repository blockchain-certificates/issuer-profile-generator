const documentLoader = require('../utils/documentLoader');

async function signEd25519 (privateKeyMultibase, publicKeyMultibase, data) {
  if (typeof data === 'string') {
    data = JSON.parse(data);
  }
  const keyPair = {
    privateKeyMultibase,
    publicKeyMultibase
  };
  const { Ed25519Signature2020 } = await import('@digitalbazaar/ed25519-signature-2020');
  const { Ed25519VerificationKey2020 } = await import('@digitalbazaar/ed25519-verification-key-2020');
  const ed25519Key = await Ed25519VerificationKey2020.from({
    ...keyPair
  });

  const suite = new Ed25519Signature2020({
    key: ed25519Key
  });

  const jsigs = await import('jsonld-signatures');
  const { purposes, sign } = jsigs.default;

  const signedCredential = await sign(data, {
    suite,
    purpose: new purposes.AssertionProofPurpose(),
    documentLoader
  });

  return signedCredential;
}

module.exports = signEd25519;
