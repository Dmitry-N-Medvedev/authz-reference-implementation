const {
  MacaroonsBuilder,
} = require('macaroons.js');
const {
  MacaroonsVerifier,
} = require('macaroons.js');
const RootMacaroonsBuilderArgError = require('./errors/RootMacaroonsBuilderArgError');
// const VerificationError = require('./errors/VerificationError');

const m_verify = ({ macaroon = null, key = null, caveats = null } = {}) => {
  if (
    macaroon === null
    || key === null
    || caveats === null
    || Array.isArray(caveats) === false
    || caveats.length === 0
  ) {
    throw new RootMacaroonsBuilderArgError();
  } else {
    const verifier = new MacaroonsVerifier(MacaroonsBuilder.deserialize(macaroon));

    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const caveat of caveats) {
      Object.entries(caveat).forEach(([k, v]) => {
        verifier.satisfyExact(`${k}=${v}`);
      });
    }

    return verifier.isValid(key);
  }
};

module.exports = m_verify;
