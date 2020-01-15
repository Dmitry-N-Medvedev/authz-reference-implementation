/* eslint-env node, mocha */

require('dotenv').config({
  path: 'specs/.env',
});
const {
  resolve,
} = require('path');
const util = require('util');
const {
  beforeEach,
  afterEach,
  describe,
  it,
} = require('mocha');
const {
  expect,
} = require('chai');
const WssServerUndefinedConfigError = require('../errors/WssServerUndefinedConfigError');
const WssServerEmptyConfigError = require('../errors/WssServerEmptyConfigError');
const WssServerAlreadyStartedError = require('../errors/WssServerAlreadyStartedError');
const Constants = require('../../common/constants/constants.js');

const debuglog = util.debuglog(`${Constants.debug.tokens.WssServer}:spec`);

const LibWssServer = require('../index.js');


const serverConfig = {
  ssl: {
    key_file_name: resolve(process.env.WSS_KEY_FILE_NAME),
    cert_file_name: resolve(process.env.WSS_CERT_FILE_NAME),
  },
  ws: {},
  port: parseInt(process.env.WSS_PORT, 10),
};

describe('libWss', () => {
  let LibWss = null;

  beforeEach(async () => {
    LibWss = new LibWssServer();

    return Promise.resolve();
  });

  afterEach(async () => {
    LibWss = null;

    return Promise.resolve();
  });

  it('should start/stop WebSocket Server', async () => {
    const ws = {
      compression: 0,
      maxPayloadLength: 16 * 1024 * 1024,
      idleTimeout: 10,
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
    const conf = Object.assign(Object.create(null), serverConfig, {
      ws,
    });

    await LibWss.start(conf);

    expect(LibWss.is_running).to.be.true;

    await LibWss.stop();

    expect(LibWss.is_running).to.be.false;
  });

  it('should throw WssServerUndefinedConfigError on undefined config', async () => {
    const config = undefined;

    try {
      await LibWss.start(config);
    } catch (error) {
      expect(error).to.be.instanceOf(WssServerUndefinedConfigError);
    }
  });

  it('should throw WssServerEmptyConfigError on undefined config', async () => {
    const config = {};

    try {
      await LibWss.start(config);
    } catch (error) {
      expect(error).to.be.instanceOf(WssServerEmptyConfigError);
    }
  });

  it('should throw WssServerAlreadyStartedError on starting an already started server', async () => {
    const ws = {
      compression: 0,
      maxPayloadLength: 16 * 1024 * 1024,
      idleTimeout: 10,
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
    const conf = Object.assign(Object.create(null), serverConfig, {
      ws,
    });

    await LibWss.start(conf);

    expect(LibWss.is_running).to.be.true;

    try {
      await LibWss.start(conf);
    } catch (error) {
      expect(error).to.be.instanceOf(WssServerAlreadyStartedError);

      await LibWss.stop();

      expect(LibWss.is_running).to.be.false;
    }
  });
});
