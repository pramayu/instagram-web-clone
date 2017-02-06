var handleHbs = require('express-handlebars');
var _ = require('lodash');
var strftime = require('strftime');
var model = require('../models');


var handleBar = handleHbs.create({
  defaultLayout: 'layout',
  extname: '.hbs',
  helpers: {
    timeAgo: function(tme){
      var msperMinute = 60 * 1000;
      var msperHour = msperMinute * 60;
      var msperDay = msperHour * 24;
      var msperMonth = msperDay * 30;
      var msperYear = msperDay * 365;

      var current = new Date();
      var previous = new Date(tme);
      var elapsed = Math.abs(current - previous);
      if(elapsed < msperMinute){
        return Math.round(elapsed/1000) + 's';
      } else if(elapsed < msperHour){
        return Math.round(elapsed/msperMinute) + 'm';
      } else if (elapsed < msperDay) {
        return Math.round(elapsed/msperHour) + 'h';
      } else if (elapsed < msperMonth) {
        return Math.round(elapsed/msperDay) + 'd';
      } else if (elapsed < msperYear) {
        return Math.round(elapsed/msperMonth) + 'mo';
      } else {
        return Math.round(elapsed/msperYear) + 'y';
      }

    },
    strftme: function(tme, block){
      return block.fn({time: strftime('%Y, %m, %d, %H, %M, %S', tme)});
    },
    checkFollow: function(map, data, block){
      var follower = _.find(map, function(follow){
        return follow.follower.id === data;
      });
      // return follower.follower.id;
      return block.fn({value: follower});
    },
    checkVote: function(map, data, block){
      var voter = _.find(map, function(vote){
        return vote.userId === data;
      });
      return block.fn({value: voter});
    },
    ifequal: function(v1, v2, options){
      if(v1 === v2){
        return options.fn(this);
      }
      return options.inverse(this);
    }
  }
});

module.exports = handleBar;
