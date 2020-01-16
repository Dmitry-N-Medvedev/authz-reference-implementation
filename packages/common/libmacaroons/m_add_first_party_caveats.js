/* eslint-disable no-unused-vars */

const {
  MacaroonsBuilder,
} = require('macaroons.js');
const RootMacaroonsBuilderArgError = require('./errors/RootMacaroonsBuilderArgError');

const m_add_first_party_caveats = ({ macaroon = null, caveats = null } = {}) => {
  if (
    macaroon === null
    || caveats === null
    || Array.isArray(caveats) === false
    || caveats.length === 0
  ) {
    throw new RootMacaroonsBuilderArgError();
  } else {
    let result = MacaroonsBuilder.deserialize(macaroon);
    const builder = MacaroonsBuilder.modify(result);

    // eslint-disable-next-line no-restricted-syntax
    for (const caveat of caveats) {
      Object.entries(caveat).forEach(([k, v]) => {
        builder.add_first_party_caveat(`${k}=${v}`);
      });
    }

    result = builder.getMacaroon();

    return result.serialize();
  }
};

module.exports = m_add_first_party_caveats;
