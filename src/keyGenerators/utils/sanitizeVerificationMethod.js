function sanitizeVerificationMethod (verificationMethod) {
  const publicKey = Object.keys(verificationMethod).filter(key => key.startsWith('publicKey'));
  return {
    id: verificationMethod.id,
    type: verificationMethod.type,
    controller: verificationMethod.controller,
    [publicKey]: verificationMethod[publicKey],
    revoked: verificationMethod.revoked,
    expires: verificationMethod.expires
  }
}

module.exports = sanitizeVerificationMethod;
