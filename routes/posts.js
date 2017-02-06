var express = require('express');
var router = express.Router();
var multer  = require('multer');
var fs = require('fs');
var gm = require('gm').subClass({imageMagick: true});
var model = require('../models');


var storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, './public/uploads/original');
  },
  filename: function(req, file, cb){
    cb(null, file.fieldname + '-' + Date.now());
  }
});

var upload = multer({storage: storage}).single('pics');

router.post('/upload', upload, function(req, res, next){
  if(req.file){
    var thumbname = req.file.fieldname + '-' + Date.now();
    var originalname = req.file.filename;
    gm(req.file.path)
    .resize(293, 293, '^')
    .gravity('Center')
    .extent(293, 293)
    .noProfile()
    .write('./public/uploads/thumb_293x293/'+ thumbname, function(err){
      if(!err) console.log('done');
    });
  }
  model.posts.create({
    location: req.body.location,
    caption: req.body.caption,
    thumb_img: thumbname,
    original_img: originalname,
    userId: req.user.id
  }).then(function(post, err){
    if(err){
      res.sendStatus(500);
    };
    res.redirect('/'+ req.user.username);
  });
});


router.post('/comment', function(req, res, next){
  console.log(req.body.comment);
  model.comments.create({
    body: req.body.comment,
    userId: req.user.id,
    postId: req.body.postid
  }).then(function(comment, err){
    res.send('successfully');
    if(req.body.usrid !== req.user.id){
      model.notifications.create({
        notice_type: 'comment',
        userId: req.body.usrid,
        postId: req.body.postid,
        notified_by_id: req.user.id
      });
    }
  });
});


router.post('/:id/votes', function(req, res, next){
  var post_id = req.params.id;
  model.votes.create({
    userId: req.user.id,
    postId: post_id
  }).then(function(err, vote){
    res.sendStatus(200);
    console.log(err);
  });
});

router.get('/the-comments', function(req,res, next){
  model.posts.findAll({
    include: [
      {model: model.comments, include: [{model: model.users}], limit: 4, order: '"createdAt" DESC'},
      {model: model.votes}
    ],
    attributes: ['id', 'caption']
  }).then(function(posts){
    res.send({posts: posts});
  })
});

router.get('/delete/vote/:id', function(req, res, next){
  var id = req.params.id;
  model.votes.destroy({
    where: {
      id: id
    }
  }).then(function(vote, err){
    res.sendStatus(200);
  });
});

router.get('/notifications', function(req, res, next){
  model.notifications.findAll({
    include: [
      {model: model.posts, attributes: ['id', 'caption']},
      {model: model.users, as: 'notified_by', attributes: ['id', 'username', 'avatar']}
    ],
    order: '"createdAt" DESC',
    limit: 6
  }).then(function(notifs){
    res.send({notifs: notifs});
  })
});

router.put('/notif/:id', function(req, res, next){
  model.notifications.update({
    read: true,
  },{ where: { id: req.params.id }
  }).then(function(err, user){
    res.sendStatus(200);
  });
});

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/users/login');
};
