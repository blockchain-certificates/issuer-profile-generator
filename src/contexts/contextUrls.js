async function loadContextUrls () {
  const { CONTEXT_URLS } = await import ('@blockcerts/schemas');
  return {
    ...CONTEXT_URLS,
    DID_V1_CONTEXT: 'https://www.w3.org/ns/did/v1',
    CID_V1_CONTEXT: 'https://www.w3.org/ns/cid/v1',
    SECP256K1_2019_CONTEXT: 'https://w3id.org/security/suites/secp256k1-2019/v1',
    JWS_2020_CONTEXT: 'https://w3id.org/security/suites/jws-2020/v1',
  };
}

module.exports = loadContextUrls;
