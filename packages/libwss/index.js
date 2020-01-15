const uWS = require('uWebSockets.js');
const util = require('util');
const Constants = require('../common/constants/constants.js');

const debuglog = util.debuglog(Constants.debug.tokens.WssServer);
const WssServerUndefinedConfigError = require('./errors/WssServerUndefinedConfigError.js');
const WssServerEmptyConfigError = require('./errors/WssServerEmptyConfigError.js');
const WssServerAlreadyStartedError = require('./errors/WssServerAlreadyStartedError.js');
const is_object_empty = require('../common/helpers/is_object_empty.js');


module.exports = class libWssServer {
  #config = null;

  #server = null;

  #listen_socket = null;

  get is_running() {
    return this.#listen_socket !== null;
  }

  async start(config = null) {
    if (this.#listen_socket !== null) {
      throw new WssServerAlreadyStartedError();
    }

    if (config === null && this.#config === null) {
      throw new WssServerUndefinedConfigError();
    }

    if (config !== null && is_object_empty(config) === false) {
      this.#config = config;
    } else {
      throw new WssServerEmptyConfigError();
    }

    this.#server = uWS
      .SSLApp(this.#config.ssl)
      .ws('/wss', this.#config.ws)
      // eslint-disable-next-line no-unused-vars
      .post('/calc', (res, req) => {
        res.end('OK');
      })
      .listen(this.#config.port, (token) => {
        this.#listen_socket = token;

        if (this.#listen_socket) {
          debuglog(`WssServer started on ${this.#config.port}`);
          return Promise.resolve();
        }
        debuglog(`failed to start on ${this.#config.port}`);
        return Promise.reject();
      });
  }

  async stop() {
    if (this.#listen_socket) {
      uWS.us_listen_socket_close(this.#listen_socket);
      this.#listen_socket = null;

      debuglog('WssServer stopped');
    }

    return Promise.resolve();
  }
};
