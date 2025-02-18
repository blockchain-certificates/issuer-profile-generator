const bip39 = require("bip39");
const bip32 = require("bip32");
const secp256k1 = require("secp256k1");
const { getPath } = require('./blockchainUtils');
const { getBTCAddress, getBTCNetworkInfo} = require('./blockchain/btc');
const { jwkFrom } = require('../keyUtils');
// const { fromJwk } = require('@digitalbazaar/ecdsa-multikey');
const {getEthereumAddressFromPrivateKey} = require("./blockchain/eth");

function generateKeyPairAndAddress (blockchain, network) {
  const mnemonic = bip39.generateMnemonic();
  console.warn('mnenomic phrase generated (store it safely!):');
  console.log(mnemonic);
  const seed = bip39.mnemonicToSeedSync(mnemonic);

  if (blockchain === 'bitcoin') {
    let bitcoinNetwork = getBTCNetworkInfo(network);

    // console.log('HEX format', seed.toString('hex'));
    const path = getPath(network);
    const node = bip32.fromSeed(seed, bitcoinNetwork);
    const derived = node.derivePath(path);
    const { privateKey, publicKey } = derived;
    // console.log('buffer', privateKey);
    console.log('private key bip32 generated', privateKey.toString('hex'), 'is valid: ', secp256k1.privateKeyVerify(privateKey));
    console.log('public key bip32 generated', publicKey.toString('hex'));
    console.log('WIF (this private information is needed for cert-issuer)', derived.toWIF());

    const bitcoinAddress = getBTCAddress(publicKey, network);
    console.log('bitcoin address generated', bitcoinAddress);

    const publicKeyJwk = jwkFrom(publicKey);

    // publicKeyJwk.crv = 'K-256';
    // const publicKeyMultibase = await fromJwk({ jwk: publicKeyJwk });

    return {
      bitcoinAddress,
      publicKeyJwk,
      // publicKeyMultibase
    };
  } else if (blockchain === 'ethereum') {
    const path = getPath(network);
    const node = bip32.fromSeed(seed, null);
    const derived = node.derivePath(path);
    const { privateKey, publicKey } = derived;

    console.log('private key bip32 generated', privateKey.toString('hex'), 'is valid: ', secp256k1.privateKeyVerify(privateKey));
    console.log('public key bip32 generated', publicKey.toString('hex'));

    const ethereumAddress = getEthereumAddressFromPrivateKey(privateKey);
    const publicKeyJwk = jwkFrom(publicKey);

    // publicKeyJwk.crv = 'K-256';
    // const publicKeyMultibase = await fromJwk({ jwk: publicKeyJwk });

    return {
      ethereumAddress,
      publicKeyJwk,
      // publicKeyMultibase
    };
  }
}

module.exports = generateKeyPairAndAddress;
