var bunyan  = require('bunyan');

var log = bunyan.createLogger({name: 'twitter-harvest'});

module.exports.log = function () {
  return log;
};
