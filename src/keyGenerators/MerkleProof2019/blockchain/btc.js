const bitcoin = require('bitcoinjs-lib');

function getBTCAddress (publicKey, network) {
  if (network === 'mainnet') {
    network = 'bitcoin';
  }
  const supportedNetworks = Object.keys(bitcoin.networks);
  if (!supportedNetworks.includes(network)) {
    console.error('unsupported bitcoin network, cannot generate address. Supported networks are: ', supportedNetworks.join(', '));
    return null;
  }
  return bitcoin.payments.p2pkh({ pubkey: publicKey, network: bitcoin.networks[network] }).address;
}

function getBTCNetworkInfo (network) {
  if (network === 'testnet') {
    return {
      wif: 0xef,
      bip32: {
        public: 0x043587cf,
        private: 0x04358394
      }
    };
  }
  // default network of bip32 is Bitcoin mainnet
  return null;
}

module.exports = {
  getBTCAddress,
  getBTCNetworkInfo
};
