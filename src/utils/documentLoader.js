const cidContext = require('../contexts/cid-v1.json');
const secp256k12019Context = require('../contexts/secp256k1-2019-v1.json');
const jws2020Context = require('../contexts/jws-2020-v1.json');
const loadContextUrls = require('../contexts/contextUrls');

const documentLoader = async function (url) {
  const { preloadedContexts } = await import('@blockcerts/schemas');
  const { securityLoader } = await import('@digitalbazaar/security-document-loader');
  const loader = securityLoader();
  const contextUrls = await loadContextUrls();

  preloadedContexts[contextUrls.CID_V1_CONTEXT] = cidContext;
  preloadedContexts[contextUrls.SECP256K1_2019_CONTEXT] = secp256k12019Context;
  preloadedContexts[contextUrls.JWS_2020_CONTEXT] = jws2020Context;

  if (url in preloadedContexts) {
    return {
      contextUrl: null,
      document: preloadedContexts[url],
      documentUrl: url
    };
  }
  return loader.documentLoader(url);
};

module.exports = documentLoader;
