async function loadContextUrls () {
  const { CONTEXT_URLS } = await import ('@blockcerts/schemas');
  return {
    ...CONTEXT_URLS,
    DID_V1_CONTEXT: 'https://www.w3.org/ns/did/v1',
    CID_V1_CONTEXT: 'https://www.w3.org/ns/cid/v1'
  };
}

module.exports = loadContextUrls;
