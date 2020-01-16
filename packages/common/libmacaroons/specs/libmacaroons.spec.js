/* eslint-env node, mocha */
require('dotenv').config({
  path: 'specs/.env',
});
const {
  describe,
  it,
} = require('mocha');
const {
  expect,
} = require('chai');
const m_ctor = require('../m_ctor');
const m_verify = require('../m_verify');
const m_add_first_party_caveats = require('../m_add_first_party_caveats');
const RootMacaroonsBuilderArgError = require('../errors/RootMacaroonsBuilderArgError');

describe('libMacaroons', () => {
  const key = Buffer.from(process.env.M_KEY, 'hex');
  const location = process.env.M_LOC;
  const identifier = process.env.M_IDT;

  it('should throw RootMacaroonsBuilderArgError on incorrect args at m_ctor', async () => {
    const undefined_args = undefined;

    try {
      m_ctor(undefined_args);
    } catch (error) {
      expect(error).to.be.instanceOf(RootMacaroonsBuilderArgError);
    }
  });

  it('should throw RootMacaroonsBuilderArgError on incorrect args at m_verify', async () => {
    const undefined_args = undefined;

    try {
      m_verify(undefined_args);
    } catch (error) {
      expect(error).to.be.instanceOf(RootMacaroonsBuilderArgError);
    }
  });

  it('should add 1st party caveats to a macaroons', async () => {
    const macaroon = m_ctor({
      location,
      key,
      identifier,
    });
    const caveats = [
      {
        account: 'c6df5049-c6fc-4ab9-b58f-4ffb6b3f99fb',
      },
      {
        poi: '00:1B:44:11:3A:B7',
      },
    ];

    const client_token = m_add_first_party_caveats({ macaroon, caveats });
    const is_verified = m_verify({
      macaroon: client_token,
      key,
      caveats,
    });

    expect(is_verified).to.be.true;
  });
});
