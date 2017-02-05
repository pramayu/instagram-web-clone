var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');
var gm = require('gm').subClass({
  imageMagick: true
});
var model = require('../models');

// multer
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/uploads');
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now());
  }
});
var upload = multer({
  storage: storage
}).single('avatar');


/* GET home page. */
router.get('/', isLoggedIn, function(req, res, next) {
  var currentUser = req.user.id;
  model.posts.findAll({
    include: [{
        model: model.users
      },
      {
        model: model.comments,
        order: '"createdAt" DESC'
      },
      {
        model: model.votes,
        include: [{
          model: model.users
        }]
      }
    ],
    order: '"createdAt" DESC'
  }).then(function(posts, err) {
    res.render('./main/index', {
      posts: posts,
      title: 'Instagram'
    });
  });
});

router.get('/:username', isLoggedIn, function(req, res, next) {
  var username = req.params.username;
  model.users.find({
    include: [{
        model: model.posts,
        include: [{
          model: model.comments,
          include: [{
            model: model.users
          }]
        }]
      },
      {
        model: model.relationships,
        as: 'followers',
        include: [{
          model: model.users,
          as: 'follower'
        }]
      }
    ],
    where: {
      username: username
    }
  }).then(function(user, err) {
    if (err) {
      res.redirect('/');
    }
    res.render('./main/profile', {
      user: user,
      title: user.fullname + ' (@' + user.username + ') ~ Instagram'
    });
  });
});

router.get('/accounts/edit', isLoggedIn, function(req, res, next) {
  var username = req.user.username;
  model.users.find({
    where: {
      username: username
    }
  }).then(function(user, err) {
    if (err) {
      res.redirect('/users/login');
    }
    res.render('./main/edit', {
      user: user
    });
  })
});

router.post('/accounts/edit', upload, function(req, res, next) {
  var username = req.user.username;
  var fullname = req.body.fullname;
  var xusername = req.body.username;
  var website = req.body.website;
  var bio = req.body.bio;
  var phone = req.body.phone;
  var gender = req.body.gender;
  var flname = req.file;
  if (req.file) {
    var filename = req.file.fieldname + '-' + Date.now() + '.png';
    gm(req.file.path)
      .resize(152, 152, '^')
      .gravity('Center')
      .extent(152, 152)
      .noProfile()
      .write('./public/uploads/profile/' + filename, function(err) {
        if (!err) console.log('done');
      });
  };
  model.users.update({
    fullname: fullname,
    username: xusername,
    website: website,
    bio: bio,
    phone: phone,
    gender: gender,
    avatar: filename
  }, {
    where: {
      username: username
    }
  }).then(function(err, user) {
    res.redirect(`/${req.user.username}`);
  });
});


module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/users/login');
};

function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/users/login');
};
