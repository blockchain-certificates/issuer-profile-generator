const bip32 = require('bip32');
const secp256k1 = require('secp256k1');
const generateSeed = require('../utils/generateSeed');
const { getPath } = require('./blockchainUtils');
const { getBTCAddress, getBTCNetworkInfo} = require('./blockchain/btc');
const { jwkFrom } = require('../../keyUtils');
// const { fromJwk } = require('@digitalbazaar/ecdsa-multikey');
const { getEthereumAddressFromPrivateKey } = require('./blockchain/eth');
const log = require('../../utils/log');

function generateKeyPairAndAddress ({
  blockchain,
  network,
  mnemonicSeed = ''
}) {
  const seed = generateSeed(mnemonicSeed);
  let bitcoinNetwork = blockchain === 'bitcoin' ? getBTCNetworkInfo(network) : null;

  const path = getPath(network);
  const node = bip32.fromSeed(seed, bitcoinNetwork);
  const derived = node.derivePath(path);
  const { privateKey, publicKey } = derived;

  console.log('private key bip32 generated', privateKey.toString('hex'), 'is valid: ', secp256k1.privateKeyVerify(privateKey));
  console.log('public key bip32 generated', publicKey.toString('hex'));

  console.log('\n\nUse the following private key representation for cert-issuer (in pk_issuer.txt):');
  console.log('(keep it private!!)');
  if (blockchain === 'bitcoin') {
    log.red(`${derived.toWIF()}`);
  } else if (blockchain === 'ethereum') {
    log.red('0x' + privateKey.toString('hex'));
  }
  log.spacer();

  const publicKeyJwk = jwkFrom(publicKey);

  // publicKeyJwk.crv = 'K-256';
  // const publicKeyMultibase = await fromJwk({ jwk: publicKeyJwk });

  const address = blockchain === 'bitcoin' ? getBTCAddress(publicKey, network) : getEthereumAddressFromPrivateKey(privateKey);

  console.warn('issuing address generated (remember to add some fund to it before issuance): ');
  log.red(address);
  log.spacer();

  return {
    address,
    blockchain,
    publicKeyJwk,
    // publicKeyMultibase
  }
}

module.exports = generateKeyPairAndAddress;
