var express = require('express');
var router = express.Router();
var model = require('../models');



router.post('/follow/:id', function(req, res, next){
  var followed = req.params.id;
  var follower = req.user.id;
  model.relationships.create({
    userId: followed,
    followerId: follower
  }).then(function(err, user){
    res.sendStatus(200);
    model.notifications.create({
      notice_type: 'follow',
      userId: req.params.id,
      notified_by_id: req.user.id
    })
  });
});



module.exports = router;
