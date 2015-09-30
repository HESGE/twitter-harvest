var log               = require('./mylog').log();
var Validator         = require('jsonschema').Validator;
var schemaCfgPrivate  = require('../schema/schema-cfg-private.json');
var cfg               = require('../cfg/cfg.json');
var cfgPrivate        = require('../' + cfg.private_cfg);

log.info('read config file');
var v = new Validator();

module.exports.cfg = function () {
  var r = v.validate(cfgPrivate, schemaCfgPrivate);
  if (r.errors.length > 0) {
    throw new Error(r.errors[0].stack + ' in cfg-private.json');
  }
  // push private config to general config
  for (var key in cfgPrivate) {
    if (cfgPrivate.hasOwnProperty(key)) {
      cfg[key] = cfgPrivate[key];
    }
  }
  return cfg;
};
