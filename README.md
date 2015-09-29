
[npm-image]: https://badge.fury.io/js/twitter-harvest.svg
[npm-url]: https://npmjs.org/package/twitter-harvest
[travis-image]: https://travis-ci.org/HESGE/twitter-harvest.svg?branch=master
[travis-url]: https://travis-ci.org/HESGE/twitter-harvest
[daviddm-image]: https://david-dm.org/HESGE/twitter-harvest.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/HESGE/twitter-harvest
[coveralls-image]: https://coveralls.io/repos/HESGE/twitter-harvest/badge.svg
[coveralls-url]: https://coveralls.io/r/HESGE/twitter-harvest

# twitter-harvest [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]
> A simple continuous harvester for twitter

This application is able to capture tweets which happen around the world. Currently it works only with the Twitter stream API 1.1.
* You have to define or modify the `cfg/cfg.json` and create at least one capture `agent` in `cfg/agents/` directory (`enable` to `true`).
* You can activate mail alert from a SMTP account like gmail (see Private configuration and the `mail_alert` flag in main configuration)
* If `fs_output` is `true` (default), the captured tweets are written to the file system with the following convention:

>data_dir/year/month/day/hour-min-sec_tweet-id

e.g.

>data/2015/9/24/16-30-44_647055571951190000

## Install

```sh
$ npm install --save twitter-harvest
```


## Usage

```js
node twitter-harvest.js
```

## Usage with `forever`

```sh
$ npm install -g forever
$ forever start twitter-harvest.js
```

With forever it is possible to run the task 'forever'. And leave your session.

## Main configuration

```json
{
  "agents_dir"    : "cfg/agents/",
  "data_dir"      : "./data/",
  "private_cfg"   : "./cfg/cfg-private.json",

  "mail_alert"    : false,

  "fs_out"        : true,
  "std_out"       : true,
}
```

* agents_dir: path where to put the agent file
* data_dir: path where to write the tweets on the file system
* private_cfg: file where private data is stored (such as mail credential)
* mail_alert: if true enable mail alerting in case of failure
* fs_out: if true write the twitter data on the file system
* std_out: if true write the twitter data on the console

## Agents configuration

> put all the agent definition files to the agent directory (one file per agent).

```sh
$ cat cfg/agents/*.json
```

```json
{
  "type_doc"            : "twitter",
  "enable"              : true,
  "type_filter"         : "track",
  "type_api"            : "stream",
  "name"                : "keywords-geneva",
  "filter"              : {
    "track"             : "genève,geneva,genebra,genevra,genf"
  },
  "stream"              : "filter",
  "consumer_key"        : "...",
  "consumer_secret"     : "...",
  "access_token_key"    : "...",
  "access_token_secret" : "..."  
}
```

to capture all the tweets where there is a mention of geneva word for several languages.


```json
{
  "type_doc"            : "twitter",
  "enable"              : true,
  "type_filter"         : "locations",
  "type_api"            : "stream",
  "name"                : "location-geneva",
  "filter"              : {
    "locations"  : "5.77,45.85,7.15,46.80"
  },
  "stream"              : "filter",
  "consumer_key"        : "...",
  "consumer_secret"     : "...",
  "access_token_key"    : "...",
  "access_token_secret" : "..."
}
```

to capture all the tweets which are posted around Geneva area (Switzerland).

* type_doc : 'twitter'
* enable : if `true` this agent is launched
* type_filter : locations | filter | follow
* stream : filter | firehose (if you have the chance)
* consumer_key, consumer_secret, access_token_key, access_token_secret : personal keys given by twitter for using their APIs

more API twitter doc https://dev.twitter.com/streaming/overview/request-parameters

## Private configuration

```json
{
  "mail_service"    : "gmail",
  "mail_auth_user"  : "username",
  "mail_auth_path"  : "password",
  "mail_from"       : "alert_twitter_harvest",
  "mail_to"         : "name@gmail.com"
}
```

* mail_service : name of the mail service
* mail_auth_user : username credential of the mail service
* mail_auth_path : password credential of the mail service
* mail_from : who will send the mail
* mail_to : who want to be alerted

One mail is also sent when the system is started, you should received this mail on your mail box if all well configured.

>note : supported mail system is given by nodemailer node module (here is the supported service https://github.com/andris9/nodemailer-wellknown#supported-services), but only gmail was tested
for gmail, it is possible you have to decrease the security level of your mail account (so don't use a personal account) and to authorize specifically the application by using this url: https://g.co/allowaccess



## Test

```sh
$ gulp
```

## To do

* add more tests
* add extra option to add extra info in the output(from agents)
* add realtime writing to search engine (already done somewhere for Solr) or other db
* add other api interface (not only the streaming API)
* improve robustness
   * mail alert (done)
   * check json syntax


## License

MIT © [Arnaud Gaudinat](http://bitem.hesge.ch/people/arnaud-gaudinat)
