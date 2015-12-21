var mkdirp  = require('mkdirp');
var log     = require('./mylog').log();
var fs      = require('fs.extra');

/* init the fs interface by creating the directory of data if needeed */
var FsInterface = function (dataDir) {
  log.info('create the dataDir ' + dataDir + ' if doesn\'t exist');
  this.dataDir = dataDir;
  //create the main dir
  mkdirp.sync(dataDir);
  //create the todo dir (to know what file need to be indexed)
  mkdirp.sync(dataDir + '/TODO');
};

/* convert the tweet date to a path directory  or a file like this year/month/day/hour-min-sec_ */
/* where sep separate year month and day
/* in twitter date is like this "Fri Feb 20 07:44:25 +0000 2015" */
FsInterface.prototype.convertDateToDirName = function (dateStr, sep) {
  var date = new Date(Date.parse(dateStr));
  var newDateStr = date.getFullYear() + sep + ('0' + (date.getMonth() + 1)).slice(-2) + sep + ('0' + date.getDate()).slice(-2) + sep + ('0' + date.getHours()).slice(-2) + '-' + ('0' + date.getMinutes()).slice(-2) + '-' + ('0' + date.getSeconds()).slice(-2) + '_';
  return newDateStr;
};

/* write tweet file on the file system */

FsInterface.prototype.write = function (tweet, todo, callback) {
  var pathDate = this.convertDateToDirName(tweet.created_at, '/');
  var pathDateFile = this.convertDateToDirName(tweet.created_at, '_');
  var dataDir = this.dataDir;
  // extract only the directory path
  var onlyDir = pathDate.substr(0, pathDate.lastIndexOf('/'));
  fs.mkdirsSync(dataDir + onlyDir); // TODO: change to async

  this.pathDate = pathDate;

  // write the tweet
  fs.writeFile(dataDir + pathDate + tweet.id + '.json', JSON.stringify(tweet), function (err) {
    if (err) {
      log.error(err);
      return callback(err);
    }
    log.info('The file was saved!');

    if (todo) {
      fs.writeFile(dataDir + 'TODO/' + pathDateFile + tweet.id + '.json', function () {
        if (err) {
          log.error(err);
          return callback(err);
        }

        log.info('The file was saved!');
        callback(null);
      });
    }
    else {
      callback(null);
    }
  });


};

/* read tweet file from the file system */
FsInterface.prototype.read = function (id, created_at, callback) {
  var pathDate = this.convertDateToDirName(created_at, '/');
  fs.readFile(this.dataDir + pathDate + id + '.json', 'utf8', function (err, data) {
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
