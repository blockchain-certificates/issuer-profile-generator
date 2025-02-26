const skeleton = {
  "@context": [
    "https://www.w3.org/ns/cid/v1",
    "https://www.w3.org/ns/credentials/v2",
    "https://w3id.org/blockcerts/v3.2"
  ],
  "type": ["BlockcertsIssuerProfile"]
}

function generateIssuerProfile(properties) {
  const issuerProfile = { ...skeleton, ...properties };
  return issuerProfile;
}

module.exports = generateIssuerProfile;
