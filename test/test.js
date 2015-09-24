var assert  = require('chai').assert;
var should  = require('chai').should();
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
      //assert(harvest.agents().length === 2, '2 agents');
      harvest.agents().length.should.equal(2);
    });
    it('should have these values in first agent object ', function () {
      assert(harvest.agents()[0].type_doc === 'twitter', 'type_doc is twitter');
      assert(harvest.agents()[0].enable === true, 'enable is false');
      harvest.agents()[0].type_filter.should.equal('track');
      assert(harvest.agents()[0].type_api === 'stream', 'type_api is stream');
      assert(harvest.agents()[0].name === 'keywords-geneva', 'name is keywords-geneva');
      assert.isNotNull(harvest.agents()[0].filter, 'filter as a value');
      assert(harvest.agents()[0].stream === 'filter', 'stream is filter');
      assert.isNotNull(harvest.agents()[0].consumer_key, 'consumer_key has a value');
      assert.isNotNull(harvest.agents()[0].consumer_secret, 'consumer_secret has a value');
      assert.isNotNull(harvest.agents()[0].access_token_key, 'access_token_key has a value');
      assert.isNotNull(harvest.agents()[0].access_token_secret, 'consumer_key has a value');
    });
    it('should have these values in second agent object ', function () {
      harvest.agents()[1].type_doc.should.equal('twitter');
      harvest.agents()[1].enable.should.equal(true);
      harvest.agents()[1].type_filter.should.equal('locations');
      harvest.agents()[1].type_api.should.equal('stream');
      harvest.agents()[1].name.should.equal('location-geneva');
      should.exist(harvest.agents()[1].filter);
      should.exist(harvest.agents()[1].consumer_key);
      should.exist(harvest.agents()[1].consumer_secret);
      should.exist(harvest.agents()[1].access_token_key);
      should.exist(harvest.agents()[1].access_token_secret);
    });
  });
});
