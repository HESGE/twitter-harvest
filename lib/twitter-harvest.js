/*eslint no-console: 0*/
var log         = require('./mylog').log();
var cfg         = require('./cfg').cfg();
var fs          = require('fs');
//var Twitter     = require('Twitter');
var Twit        = require('twit');
var FsInterface = require('./fs-interface');
var nodemailer  = require('nodemailer');
var Validator   = require('jsonschema').Validator;
var schemaAgent = require('../schema/schema-agent.json');
var schemaCfg   = require('../schema/schema-cfg.json');


var fsInterface = new FsInterface(cfg.data_dir); //init fs output

var v = new Validator(); //init json schema validator

var agents = []; // list of agents

var transporter; // mail transporter for alert system

log.info('start twitter-harvest log system');


// alertMail to send a mail alert following the configuration
var alertMail = function (subject, text) {
  if (cfg.mail_alert) {
    transporter.sendMail({
      from      : cfg.mail_from,
      to        : cfg.mail_to,
      subject   : subject,
      text      : text
    }, function (error, info){
      if (error) {
        log.error(error);
      }
      else {
        log.info('Message sent: ' + info.response);
      }
    });
  }
};

// listenStream, to listen one twitter stream until nbTweets or forever
// write on fs too
var listenStream = function (stream, agent, nbTweets) {
  //console.log(agent);

  stream.on('connect', function (response) {
    log.info('twitter connect ' + response);
    alertMail('alert mail started for get-sample for twitter', 'connect');
  });

  stream.on('disconnect', function (disconnectMessage) {
    log.error('twitter disconnect code: ' + disconnectMessage.code);
    log.error('twitter disconnect reason: ' + disconnectMessage.reason);
    alertMail('alert mail disconnect ', disconnectMessage.reason);
  });

  stream.on('limit', function (limitMessage) {
    log.info('twitter limit track: ' + limitMessage.track);
    alertMail('alert mail for get-sample:', 'twitter limit track: ' + limitMessage.track);
  });

  stream.on('limit', function (limitMessage) {
    log.info('twitter limit track: ' + limitMessage.track);
    alertMail('alert mail for get-sample:', 'twitter limit track: ' + limitMessage.track);
  });

  stream.on('tweet', function (tweet) {
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
    if (cfg.mail_alert) {
      alertMail(agent.name, 'ERROR=' + error);
    }
    throw error;
  });
};


// launch a twitter agent
var runAgent = function (agent, nbTweets) {

  if (agent.enable) {
    log.info('start twitter agent :' + agent.name);

    var T = new Twit({
      consumer_key        : agent.consumer_key,
      consumer_secret     : agent.consumer_secret,
      access_token        : agent.access_token_key,
      access_token_secret : agent.access_token_secret
    });

    if (agent.type_api === 'stream') {

      T.stream('statuses/' + agent.stream, agent.filter, function (stream) {

        log.info('start listen Stream');
        listenStream(stream, agent, nbTweets);
      });
      return T;
    }
    else {// else if (agent.type_api === 'query') {
      log.info('query agent');
    }
  }

};

// init, read the cfg and the list of twitter agents on several JSON fs
var init = function (nbTweets) {

  //check if cfg is a valide json from a schema
  var r1 = v.validate(cfg, schemaCfg);
  if (r1.errors.length > 0) {
    throw new Error(r1.errors[0].stack + ' in cfg.json');
  }

  // init of the mailer for alerting
  if (cfg.mail_alert) {
    transporter = nodemailer.createTransport({
      service: cfg.mail_service,
      auth: {
        user: cfg.mail_auth_user,
        pass: cfg.mail_auth_path
      }
    });
    // just to send an email at the startup
    alertMail('alert mail started for twitter-harvest', 'no error');
  }

  // read the agents directory
  var dir = cfg.agents_dir;

  fs.readdir(dir, function (err1, files){
    if (err1) {
      throw err1;
    }
    // loop the files
    files.forEach(function (file){
      fs.readFile(dir + file, 'utf-8', function (err2, json){
        if (err2) {
          throw err2;
        }
        // check if the json of agent is valide
        var r2 = v.validate(JSON.parse(json), schemaAgent);
        if (r2.errors.length > 0) {
          throw new Error(r2.errors[0].stack + ' in ' + file);
        }
        var agent = JSON.parse(json);
        if (agent.enable) {
          agents.push(agent);
        }
        // start agent one by one
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
