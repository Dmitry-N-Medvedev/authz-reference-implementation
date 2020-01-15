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

const WebSocket = require('ws');
const Constants = require('../../common/constants/constants.js');

const debuglog = util.debuglog(`${Constants.debug.tokens.WssServer}:spec`);

const LibWssServer = require('../index.js');


const serverConfig = {
  ssl: {
    key_file_name: resolve(process.env.WSS_KEY_FILE_NAME),
    cert_file_name: resolve(process.env.WSS_CERT_FILE_NAME),
    // passphrase: '',
  },
  handlers: {
    compression: 0,
    maxPayloadLength: 16 * 1024 * 1024,
    idleTimeout: 10,
  },
  port: parseInt(process.env.WSS_PORT, 10),
  path: process.env.WSS_PATH,
};

describe('libWss', () => {
  let LibWss = null;
  const address = `${process.env.WSS_PROTO}://${process.env.WSS_HOST}:${process.env.WSS_PORT}${process.env.WSS_PATH}`;

  beforeEach(async () => {
    LibWss = new LibWssServer();

    return Promise.resolve();
  });

  afterEach(async () => {
    LibWss = null;

    return Promise.resolve();
  });

  // eslint-disable-next-line no-async-promise-executor
  it.only('should send/receive a message', async () => new Promise(async (ok) => {
    const handlers = {
      // eslint-disable-next-line
      open: (ws, req) => {
        debuglog(`websocket connected via ${req.getUrl()}`);
        const xToken = req.getHeader(Constants.token.name) || null;

        if (xToken === null) {
          ws.end(401, 'not authenticated');
        }
      },
      // eslint-disable-next-line
      message: (ws, message, isBinary) => {
        debuglog('message received:', message, isBinary);

        if (isBinary === false) {
          debuglog('message received is not binary. closing');
          ws.close();
        } else {
          ws.send(message, isBinary);
        }
      },
      // eslint-disable-next-line
      close: (ws, code, message) => {
        debuglog(`socket closed w/ ${code} and ${message}`);
      },
    };

    const conf = Object.assign(
      Object.create(null), serverConfig, { handlers: { ...serverConfig.handlers, ...handlers } },
    );

    const start = async () => {
      await LibWss.start(conf);

      expect(LibWss.is_running).to.be.true;

      return Promise.resolve();
    };
    const stop = async () => {
      await LibWss.stop();

      expect(LibWss.is_running).to.be.false;

      return Promise.resolve();
    };
    const message = JSON.stringify({
      type: 'some-type',
      payload: [0, 1, 2],
    });
    const binaryMessage = (new TextEncoder()).encode(message).buffer;

    await start();


    const client = new WebSocket(address, [], {
      rejectUnauthorized: false,
      perMessageDeflate: false,
      headers: {
        [Constants.token.name]: 'x-token-value',
      },
    });

    client.binaryType = 'arraybuffer'; // consider using 'fragments' on large data frames

    client.on('open', () => {
      debuglog('client:open');

      client.send(binaryMessage, {
        compress: false,
        binary: true,
        fin: true,
      }, (err) => {
        if (err) {
          debuglog('client:send:err', err);
        } else {
          debuglog('client:message sent');
        }
      });
    });

    client.on('message', (data) => {
      const msg = (new TextDecoder()).decode(data);

      expect(msg).to.equal(message);

      client.close(1000, 'bye');
    });

    client.on('close', async (code, reason) => {
      debuglog('client:close', code, reason);

      await stop();

      ok();
    });

    client.on('error', (error) => {
      debuglog('client:error', error);
    });

    client.on('ping', (data) => {
      debuglog('client:ping', data);
    });

    client.on('pong', (data) => {
      debuglog('client:pong', data);
    });

    client.on('unexpected-response', (req, res) => {
      debuglog('client:unexpected-response', req, res);
    });
  }));

  // client.binaryType = 'arraybuffer'; // consider using 'fragments' on large data frames
});
