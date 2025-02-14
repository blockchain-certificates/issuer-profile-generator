const keyto = require('@trust/keyto');
const base64url = require('base64url');
const secp256k1 = require('secp256k1');
const crypto = require('node:crypto');
const canonicalize = require('canonicalize');

const getKid = (jwk) => {
  const copy = { ...jwk };
  delete copy.d;
  delete copy.kid;
  delete copy.alg;
  const digest = crypto
    .createHash('sha256')
    .update(canonicalize(copy))
    .digest();

  return base64url.encode(Buffer.from(digest));
};

const privateKeyJwkFromPrivateKeyHex = (privateKeyHex) => {
  const jwk = {
    ...keyto.from(privateKeyHex, 'blk').toJwk('private'),
    crv: 'secp256k1',
  };
  const kid = getKid(jwk);
  return {
    ...jwk,
    kid
  };
};

const publicKeyJwkFromPublicKeyHex = (publicKeyHex) => {
  const compressedHexEncodedPublicKeyLength = 66;
  let key = publicKeyHex;
  if (publicKeyHex.length === compressedHexEncodedPublicKeyLength) {
    const keyBin = secp256k1.publicKeyConvert(
      Buffer.from(publicKeyHex, 'hex'),
      false
    );
    key = Buffer.from(keyBin).toString('hex');
  }
  const jwk = {
    ...keyto.from(key, 'blk').toJwk('public'),
    crv: 'secp256k1',
  };
  const kid = getKid(jwk);

  return {
    ...jwk,
    kid
  };
};


module.exports = {
  privateKeyJwkFromPrivateKeyHex,
  publicKeyJwkFromPublicKeyHex
}
