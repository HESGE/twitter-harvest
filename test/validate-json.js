var should            = require('chai').should();
var Validator         = require('jsonschema').Validator;
var schemaCfg         = require('../schema/schema-cfg.json');
var cfg               = require('../cfg/cfg.json');
var schemaCfgPrivate  = require('../schema/schema-cfg-private.json');
var cfgPrivate        = require('../cfg/cfg-private.json');
var schemaAgent       = require('../schema/schema-agent.json');
var fs                = require('fs');

describe('validateJson', function () {
  var v = new Validator();
  describe('cfg.json', function () {
    it('should respect the cfg schema', function () {
      var result = v.validate(cfg, schemaCfg);
      should.exist(result);
      var allMsgError = '';
      for (var e in result.errors) {
        allMsgError += '\n' + result.errors[e].stack;
      }
      allMsgError.should.equal('');
    });
  });
  describe('cfg-private.json', function () {
    it('should respect the cfg-private schema', function () {
      var result = v.validate(cfgPrivate, schemaCfgPrivate);
      should.exist(result);
      var allMsgError = '';
      for (var e in result.errors) {
        allMsgError += '\n' + result.errors[e].stack;
      }
      allMsgError.should.equal('');
    });
  });

  describe('JSON agents', function () {
    it('should respect the agent schema', function () {
      var dir = cfg.agents_dir;

      fs.readdir(dir, function (err1, files){
        if (err1) {
          throw err1;
        }
        files.forEach(function (file){
          fs.readFile(dir + file, 'utf-8', function (err2, jsonAgent){
            if (err2) {
              throw err2;
            }
            var result = v.validate(jsonAgent, schemaAgent);
            should.exist(result);
            var allMsgError = '';
            for (var e in result.errors) {
              allMsgError += '\n' + result.errors[e].stack;
            }
            allMsgError.should.equal('');
          });
        });
      });
    });
  });
});
