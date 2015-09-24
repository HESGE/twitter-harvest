/*eslint no-console: 0*/
var log         = require('./mylog').log();
var cfg         = require('./cfg').cfg();
var fs          = require('fs');
var Twitter     = require('Twitter');
var FsInterface = require('./fs-interface');

var fsInterface = new FsInterface(cfg.data_dir);

var agents = [];

log.info('start twitter-harvest log system');

// listenStream, to listen one twitter stream until nbTweets or forever
// write on fs too
var listenStream = function (stream, agent, nbTweets) {
  //console.log(agent);
  stream.on('data', function (tweet) {
    //console.log(tweet);
    log.info(agent.name + ': ' + 'tweet received, ' + tweet.text + ' at' + tweet.created_at + ' for ' + agent.name);
    //console.log(tweet);
    //var tweetJSON = JSON.parse(tweet);
    if (cfg.fs_out) {
      fsInterface.write(tweet, function (){});
    }
    if (cfg.std_out) {
      console.log(JSON.stringify(tweet));
    }

    if (nbTweets !== undefined && nbTweets-- < 1) {
      stream.destroy();
    }
  });

  stream.on('end', function () {
    log.info(agent.name + ': ' + 'end of twitter stream');
  });


  stream.on('error', function (error) {
    log.fatal(agent.name + ': ' + error);
    throw error;
  });
};


// launch a twitter agent
var runAgent = function (agent, nbTweets) {

  if (agent.enable) {
    log.info('start twitter agent :' + agent.name);

    var clientTwitter = new Twitter({
      consumer_key        : agent.consumer_key,
      consumer_secret     : agent.consumer_secret,
      access_token_key    : agent.access_token_key,
      access_token_secret : agent.access_token_secret
    });

    if (agent.type_api === 'stream') {

      clientTwitter.stream('statuses/' + agent.stream, agent.filter, function (stream) {

        log.info('start listen Stream');
        listenStream(stream, agent, nbTweets);
      });
      return clientTwitter;
    }
    else {// else if (agent.type_api === 'query') {
      log.info('query agent');
    }
  }

};

// init, read the cfg and the list of twitter agents on several JSON fs
var init = function (nbTweets) {
  // read the cfg


  // read the agents directory
  var dir = cfg.agents_dir;

  fs.readdir(dir, function (err1, files){
    if (err1) {
      throw err1;
    }
    files.forEach(function (file){
      fs.readFile(dir + file, 'utf-8', function (err2, json){
        if (err2) {
          throw err2;
        }
        var agent = JSON.parse(json);
        if (agent.enable) {
          agents.push(agent);
        }
        runAgent(agent, nbTweets);
      });
    });
  });
};

/******************* main *************************/

module.exports.init = init;
module.exports.cfg = function () {
  return cfg;
};
module.exports.agents = function () {
  return agents;
};
