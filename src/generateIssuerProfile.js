const skeleton = {
  "@context": [
    "https://www.w3.org/ns/cid/v1",
    "https://w3id.org/blockcerts/v3"
  ],
  "type": "Profile"
}

function generateIssuerProfile(properties) {
  const issuerProfile = { ...skeleton, ...properties };
  return issuerProfile;
}

module.exports = generateIssuerProfile;
