const createKeccakHash = require('keccak');
const { Web3 } = require('web3');
const web3 = new Web3();
const elliptic = require('elliptic');
const EC = elliptic.ec;
const sha3 = require('js-sha3');
const keccak256 = sha3.keccak256;

function getEthereumAddressFromPublicKey (publicKey) {
  const publicKeyString = publicKey.toString('hex');
  const ec = new EC('secp256k1');

  // Decode public key
  const key = ec.keyFromPublic(publicKeyString, 'hex');

  // Convert to uncompressed format
  const publicKeyUncompressed = key.getPublic().encode('hex').slice(2);

  // Now apply keccak
  const address = keccak256(Buffer.from(publicKeyUncompressed, 'hex')).slice(64 - 40);
  return `0x${address.toString()}`;
}


// calculation comes from privKey and we cannot compute against DID
function getEthereumAddressFromPrivateKey (privateKey) {
  const privateKeyString = '0x' + privateKey.toString('hex');
  const address = web3.eth.accounts.privateKeyToAccount(privateKeyString).address;
  if (web3.utils.isAddress(address)) {
    return address;
  }
  console.error('Error creating ETH address.');
  return null;
}

 function toETHChecksumAddress (address) {
  address = address.toLowerCase().replace('0x', '')
  var hash = createKeccakHash('keccak256').update(address).digest('hex')
  var ret = '0x'

  for (var i = 0; i < address.length; i++) {
    if (parseInt(hash[i], 16) >= 8) {
      ret += address[i].toUpperCase()
    } else {
      ret += address[i]
    }
  }

  return ret
}

module.exports = {
  getEthereumAddressFromPrivateKey,
  getEthereumAddressFromPublicKey,
  toETHChecksumAddress
}
