var assert = require('chai').assert;
var harvest = require('../lib/twitter-harvest.js');

describe('twitter-harvest', function () {
  before(function () {
    harvest.init(1);
  });
  describe('init()', function () {
    it('should load correctly the cfg file', function () {
      assert(harvest.cfg().keep_source === true, 'keep_source is true');
    });
    it('should have 2 agents loaded ', function () {
      assert(harvest.agents().length === 2, '2 agents');
    });
    it('should have these values in first agent object ', function () {
      assert(harvest.agents()[0].type_doc === 'twitter', 'type_doc is twitter');
      assert(harvest.agents()[0].enable === false, 'enable is false');
      assert(harvest.agents()[0].type_filter === 'track', 'type_filter is track');
      assert(harvest.agents()[0].type_api === 'stream', 'type_api is stream');
      assert(harvest.agents()[0].name === 'keywords-geneva', 'name is keywords-geneva');
      assert.isNotNull(harvest.agents()[0].filter, 'filter as a value');
      assert(harvest.agents()[0].stream === 'filter', 'stream is filter');
      assert.isNotNull(harvest.agents()[0].consumer_key, 'consumer_key has a value');
      assert.isNotNull(harvest.agents()[0].consumer_secret, 'consumer_secret has a value');
      assert.isNotNull(harvest.agents()[0].access_token_key, 'access_token_key has a value');
      assert.isNotNull(harvest.agents()[0].access_token_secret, 'consumer_key has a value');
    });
  });
});
