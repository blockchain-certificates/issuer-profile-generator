const bip32 = require('bip32');
const bip39 = require('bip39');
const bitcoin = require('bitcoinjs-lib');
const secp256k1 = require('secp256k1');
// const { fromJwk } = require('@digitalbazaar/ecdsa-multikey');
const keyUtils = require('../../keyUtils');

function getPath (network) {
  // https://github.com/satoshilabs/slips/blob/master/slip-0044.md
  const chainCode = {
    'bitcoin': 0,
    'mainnet': 0,
    'testnet': 1,
    'regtest': 1,
    'ropsten': 1,
    'ethereum': 60
  };
  let chain = chainCode[network];

  if (chain == null) {
    chain = chainCode.testnet;
    console.warn(`network is not listed, defaulting to testnet ${chain}`);
  }
  // https://ethereum.stackexchange.com/a/70029
  // https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki
  return `m/44'/${chain}'/0/0/0`;
}

function getBTCAddress (publicKey, network) {
  const supportedNetworks = Object.keys(bitcoin.networks);
  if (!supportedNetworks.includes(network)) {
    console.error('unsupported bitcoin network, cannot generate address. Supported networks are: ', supportedNetworks.join(', '));
    return null;
  }
  return bitcoin.payments.p2pkh({ pubkey: publicKey, network: bitcoin.networks[network] }).address;
}

function jwkFrom (key, isPrivate = false) /* @trust/keyto */ {
  // TODO: should we keep the `kid` property?
  const keyToHexString = key.toString('hex');
  if (isPrivate) {
    return keyUtils.privateKeyJwkFromPrivateKeyHex(keyToHexString);
  }
  return keyUtils.publicKeyJwkFromPublicKeyHex(keyToHexString);
}

async function generateFromBip32 (network) {
  const mnemonic = bip39.generateMnemonic();
  console.log('mnenomic phrase generated (store it safely):');
  console.log(mnemonic);
  let bitcoinNetwork = null; // default network of bip32 is Bitcoin mainnet

  if (network === 'testnet') {
    // https://github.com/bitcoinjs/bip32/pull/7/files
    bitcoinNetwork = {
      wif: 0xef,
      bip32: {
        public: 0x043587cf,
        private: 0x04358394
      }
    }
  }

  const seed = bip39.mnemonicToSeedSync(mnemonic);
  // console.log('HEX format', seed.toString('hex'));
  const node = bip32.fromSeed(seed, bitcoinNetwork);
  const path = getPath(network);
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
    publicKey,
    publicKeyJwk,
    // publicKeyMultibase
  };
}

module.exports = generateFromBip32;
