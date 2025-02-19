# Issuer Profile Generator

A CLI tool to generate a Blockcerts Issuer Profile.

## Usage

```bash
  node scripts/prompt.js
```

TODO:
- [ ] generate verificationMethod
  - [ ] allow selection of key type (EC, ED25519)
  - [ ] allow selection of key format (jwk, multibase, ...)
  - [x] provide private key in the stdout
  - [x] store public key in verificationMethod
  - [x] if a blockchain, provide the address in the stdout
  - [x] let user select the purpose of the key
- [ ] sign the issuer profile
  - [ ] manage external controller
  - [ ] allow self signing?
- [ ] propose generating a DID document
  - [ ] methods TBD
- [ ] save the issuer profile in a file
