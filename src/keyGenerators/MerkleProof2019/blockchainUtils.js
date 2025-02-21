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

module.exports = {
  getPath
};
