var should      = require('chai').should();
var FsInterface = require('../lib/fs-interface.js');
//var fs          = require('fs');
var fs          = require('fs.extra');


/*eslint-disable */
var tweetSet = {
  "created_at": "Fri Feb 20 07:44:25 +0000 2015",
  "id": 568677540535111700,
  "id_str": "568677540535111680",
  "text": "Video web: L'avez-vous remarqué ? Facebook fait de l'auto play de vos vidéos uniquement pour les premières secondes de celles-ci #engagement",
  "source": "<a href=\"http://twitter.com/#!/download/ipad\" rel=\"nofollow\">Twitter for iPad</a>",
  "truncated": false,
  "in_reply_to_status_id": null,
  "in_reply_to_status_id_str": null,
  "in_reply_to_user_id": null,
  "in_reply_to_user_id_str": null,
  "in_reply_to_screen_name": null,
  "user": {
    "id": 55223,
    "id_str": "55223",
    "name": "Thierry Weber",
    "screen_name": "thierryweber",
    "location": "breew, lausanne",
    "url": "http://about.me/thierryweber",
    "description": "Founder and CEO of http://breew.com \r\nOfficial and personal website: http://thierryweber.com",
    "protected": false,
    "verified": false,
    "followers_count": 5411,
    "friends_count": 2713,
    "listed_count": 195,
    "favourites_count": 745,
    "statuses_count": 19535,
    "created_at": "Sun Dec 10 14:41:36 +0000 2006",
    "utc_offset": 3600,
    "time_zone": "Paris",
    "geo_enabled": true,
    "lang": "fr",
    "contributors_enabled": false,
    "is_translator": false,
    "profile_background_color": "5F6A6B",
    "profile_background_image_url": "http://pbs.twimg.com/profile_background_images/45819265/TW-ustream-background.jpg",
    "profile_background_image_url_https": "https://pbs.twimg.com/profile_background_images/45819265/TW-ustream-background.jpg",
    "profile_background_tile": false,
    "profile_link_color": "8A0505",
    "profile_sidebar_border_color": "5F6E4C",
    "profile_sidebar_fill_color": "BBBFB2",
    "profile_text_color": "000000",
    "profile_use_background_image": true,
    "profile_image_url": "http://pbs.twimg.com/profile_images/56014178/TW-2_normal.jpg",
    "profile_image_url_https": "https://pbs.twimg.com/profile_images/56014178/TW-2_normal.jpg",
    "profile_banner_url": "https://pbs.twimg.com/profile_banners/55223/1398261052",
    "default_profile": false,
    "default_profile_image": false,
    "following": null,
    "follow_request_sent": null,
    "notifications": null
  },
  "geo": {
    "type": "Point",
    "coordinates": [
      46.514344,
      6.618263
    ]
  },
  "coordinates": {
    "type": "Point",
    "coordinates": [
      6.618263,
      46.514344
    ]
  },
  "place": {
    "id": "6c07f3233c333f95",
    "url": "https://api.twitter.com/1.1/geo/id/6c07f3233c333f95.json",
    "place_type": "city",
    "name": "Lausanne",
    "full_name": "Lausanne, Vaud",
    "country_code": "CH",
    "country": "Schweiz",
    "bounding_box": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            6.583303,
            46.45497
          ],
          [
            6.583303,
            46.60242
          ],
          [
            6.720858,
            46.60242
          ],
          [
            6.720858,
            46.45497
          ]
        ]
      ]
    },
    "attributes": {}
  },
  "contributors": null,
  "retweet_count": 0,
  "favorite_count": 0,
  "entities": {
    "hashtags": [
      {
        "text": "engagement",
        "indices": [
          129,
          140
        ]
      }
    ],
    "trends": [],
    "urls": [],
    "user_mentions": [],
    "symbols": []
  },
  "favorited": false,
  "retweeted": false,
  "possibly_sensitive": false,
  "filter_level": "low",
  "lang": "fr",
  "timestamp_ms": "1424418265838"
};
/*eslint-disable */

var dir = './data_test/';

describe('fs-interface', function () {
  var fsInterface = new FsInterface(dir);

  describe('new', function () {
    it('should create a data dir if doesn\'t exist' , function () {

      try {
        var stat = fs.lstatSync(dir);
      }
      catch (err){
        should.not.exist(err);
      }
    });
  });

  // "Fri Feb 20 07:44:25 +0000 2015"
  describe('convertDateToDir', function () {
    it('should convert date to path', function (done) {

        var datePath = fsInterface.convertDateToDir( tweetSet.created_at);
        datePath.should.equal('2015/2/20/8-44-25_');
        done();


    });
  });

  describe('write', function () {
    it('should write a tweet on the file system', function (done) {


        fsInterface.write(tweetSet, function (err1) {
          if (err1) {
            should.not.exist(err1);
          }
          else {
            try {
              var stat = fs.lstatSync(dir + fsInterface.pathDate + tweetSet.id);
            }
            catch (err2) {
              should.not.exist(err2);
            }
          }
          done();
        });

    });
  });

  describe('read', function () {
    it('should read a tweet on the file system', function (done) {

        fsInterface.read( tweetSet.id, tweetSet.created_at, function (err,data) {
          var tweetGet = JSON.parse(data);
          should.exist(tweetGet);
          tweetGet.should.equal(tweetGet);
          fs.rmrfSync(dir);
          done();
        });


    });
  });


});
