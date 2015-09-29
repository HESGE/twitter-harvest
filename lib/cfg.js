var log     = require('./mylog').log();

log.info('read config file');
var cfg = require('../cfg/cfg.json');
var cfgPrivate = require('../' + cfg.private_cfg);

module.exports.cfg = function () {
  // push private config to general config
  for (var key in cfgPrivate) {
    if (cfgPrivate.hasOwnProperty(key)) {
      cfg[key] = cfgPrivate[key];
    }
  }
  return cfg;
};
