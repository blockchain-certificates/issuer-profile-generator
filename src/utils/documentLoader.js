const cidContext = require('../contexts/cid-v1.json');
const documentLoader = async function (url) {
  const { preloadedContexts } = await import('@blockcerts/schemas');
  const { securityLoader } = await import('@digitalbazaar/security-document-loader');
  const loader = securityLoader();

  preloadedContexts['https://www.w3.org/ns/cid/v1'] = cidContext;

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
