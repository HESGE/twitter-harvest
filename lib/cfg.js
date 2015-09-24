var log     = require('./mylog').log();

log.info('read config file');
var cfg = require('../cfg/cfg.json');

module.exports.cfg = function () {
  return cfg;
};
