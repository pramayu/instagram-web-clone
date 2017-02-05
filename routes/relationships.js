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
    if(err){
      res.sendStatus(500);
    }
    res.sendStatus(200);
  });
});



module.exports = router;
