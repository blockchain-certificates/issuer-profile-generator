# Issuer Profile Generator

A CLI tool to generate a Blockcerts Issuer Profile.

The tool allows the creation of Blockchain (BTC and ETH) addresses outputting mnemonic, private key and issuing address, and will store the corresponding public key into the Issuer Profile.

## Usage

### Generate an Issuer Profile

```bash
  node scripts/generate.js
```

### Sign an existing Issuer Profile

```bash
  node scripts/sign-existing.js
```

TODO:
- [ ] generate verificationMethod
  - [ ] allow selection of key type (EC, ED25519)
  - [ ] allow selection of key format (jwk, multibase, ...)
  - [x] provide private key in the stdout
  - [x] store public key in verificationMethod
  - [x] if a blockchain, provide the address in the stdout
  - [x] let user select the purpose of the key
  - [x] allow creating key from seed phrase
- [ ] sign the issuer profile
  - [ ] manage external controller
  - [x] allow self signing
- [ ] propose generating a DID document
  - [ ] methods TBD
- [x] save the issuer profile in a file
