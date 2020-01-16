const {
  MacaroonsBuilder,
} = require('macaroons.js');
const RootMacaroonsBuilderArgError = require('./errors/RootMacaroonsBuilderArgError');

const m_ctor = ({ location = null, key = null, identifier = null } = {}) => {
  if (location === null || key === null || identifier === null) {
    throw new RootMacaroonsBuilderArgError();
  } else {
    return MacaroonsBuilder.create(location, key, identifier).serialize();
  }
};

module.exports = m_ctor;
