var mkdirp  = require('mkdirp');
var log     = require('./mylog').log();
var fs      = require('fs.extra');

/* init the fs interface by creating the directory of data if needeed */
var FsInterface = function (dataDir) {
  log.info('create the dataDir ' + dataDir + ' if doesn\'t exist');
  this.dataDir = dataDir;
  mkdirp.sync(dataDir);
};

/* convert the tweet date to a path directory like this year/month/day/hour-min-sec_ */
/* in twitter date is like this "Fri Feb 20 07:44:25 +0000 2015" */
FsInterface.prototype.convertDateToDir = function (dateStr) {
  var date = new Date(Date.parse(dateStr));
  var newDateStr = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getHours() + '-' + date.getMinutes() + '-' + date.getSeconds() + '_';
  return newDateStr;
};

/* write tweet file on the file system */
FsInterface.prototype.write = function (tweet, callback) {
  var pathDate = this.convertDateToDir(tweet.created_at);
  // extract only the directory path
  var onlyDir = pathDate.substr(0, pathDate.lastIndexOf('/'));
  fs.mkdirsSync(this.dataDir + onlyDir); // TODO: change to async

  this.pathDate = pathDate;
  fs.writeFile(this.dataDir + pathDate + tweet.id, JSON.stringify(tweet), function (err) {
    if (err) {
      log.error(err);
      return callback(err);
    }

    log.info('The file was saved!');
    callback(null);
  });
};

/* read tweet file from the file system */
FsInterface.prototype.read = function (id, created_at, callback) {
  var pathDate = this.convertDateToDir(created_at);
  fs.readFile(this.dataDir + pathDate + id, 'utf8', function (err, data) {
    if (err) {
      log.error(err);
      return callback(err);
    }
    else {
      log.info('The file was read');
      callback(null, data);
    }
  });
};

module.exports = FsInterface;
