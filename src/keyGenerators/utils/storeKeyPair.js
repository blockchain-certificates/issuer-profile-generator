const fs = require('node:fs');
const path = require('node:path');
const log = require('../../utils/log');

function storeKeyPair (type, keyPair) {
  let filePath = path.join(__dirname, `../../../output/keyPairs/keyPair-${type}-${Date.now()}`);
  let extension = '.json';
  if (typeof keyPair !== 'string') {
    keyPair = JSON.stringify(keyPair, null, 2);
  } else {
    // case merkleproof2019, the keypair is the WIF for the private key, nothing else
    extension = '.txt';
  }
  filePath += extension;
  fs.writeFileSync(filePath, keyPair);
  log.yellow(`keyPair saved to file ${filePath} (store it safely!):`);
}

module.exports = storeKeyPair;
