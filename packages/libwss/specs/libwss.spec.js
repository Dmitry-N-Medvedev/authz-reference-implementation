/* eslint-env node, mocha */

require('dotenv').config({
  path: 'specs/.env',
});

const util = require('util');
const {
  before,
  after,
  describe,
  it,
} = require('mocha');
const { expect } = require('chai');
const Constants = require('../../common/constants/constants.js');

const debuglog = util.debuglog(`${Constants.debug.tokens.WssServer}:spec`);

const LibWssServer = require('../index.js');


const serverConfig = {
  server: {
    key_file_name: process.env.WSS_KEY_FILE_NAME,
    cert_file_name: process.env.WSS_CERT_FILE_NAME,
  },
  ws: {},
  port: parseInt(process.env.WSS_PORT, 10),
};

describe('libWss', () => {
  let LibWss = null;

  before(async () => {
    LibWss = new LibWssServer();

    return Promise.resolve();
  });

  after(async () => {
    LibWss = null;

    return Promise.resolve();
  });

  it.only('should start/stop WebSocket Server', async () => {
    const ws = {
      // eslint-disable-next-line
      open: (ws, req) => {
        debuglog(`websocket connected via ${req.getUrl()}`);
      },
      // eslint-disable-next-line
      message: (ws, message, isBinary) => {
        debuglog('message received:', message, isBinary);
      },
      // eslint-disable-next-line
      close: (ws, code, message) => {
        debuglog(`socket closed w/ ${code} and ${message}`);
      },
    };
    const conf = Object.assign(serverConfig, ws);

    await LibWss.start(conf);

    expect(LibWss.is_running).to.be.true;

    await LibWss.stop(conf);

    expect(LibWss.is_running).to.be.false;
  });
});
