/* eslint-env node, mocha */

const {
  describe,
  it,
} = require('mocha');
const {
  expect,
} = require('chai');
const WssServerUndefinedConfigError = require('../errors/WssServerUndefinedConfigError');
const WssServerEmptyConfigError = require('../errors/WssServerEmptyConfigError');
const WssServerAlreadyStartedError = require('../errors/WssServerAlreadyStartedError');

describe('libWss:errors', () => {
  it('should check WssServerUndefinedConfigError', async () => {
    try {
      throw new WssServerUndefinedConfigError();
    } catch (error) {
      expect(error).to.be.instanceOf(WssServerUndefinedConfigError);
    }
  });

  it('should check WssServerEmptyConfigError', async () => {
    try {
      throw new WssServerEmptyConfigError();
    } catch (error) {
      expect(error).to.be.instanceOf(WssServerEmptyConfigError);
    }
  });

  it('should check WssServerAlreadyStartedError', async () => {
    try {
      throw new WssServerAlreadyStartedError();
    } catch (error) {
      expect(error).to.be.instanceOf(WssServerAlreadyStartedError);
    }
  });
});
