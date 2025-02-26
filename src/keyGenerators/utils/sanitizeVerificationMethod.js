function sanitizeVerificationMethod (verificationMethod) {
  const publicKey = Object.keys(verificationMethod).filter(key => key.startsWith('publicKey'));
  return {
    id: verificationMethod.id,
    type: verificationMethod.type,
    controller: verificationMethod.controller,
    [publicKey]: verificationMethod[publicKey],
    ...verificationMethod.revoked && { revoked: verificationMethod.revoked },
    ...verificationMethod.expires && { expires: verificationMethod.expires }
  }
}

module.exports = sanitizeVerificationMethod;
