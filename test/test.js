var assert = require('assert');
var harvest = require('../lib/twitter-harvest.js');

describe('twitter-harvest', function () {
  describe('init', function () {
    it('init should load correctly the cfg file', function () {
      harvest.init(1);
      assert(harvest.cfg().keep_source, true);
    });
  });
});
