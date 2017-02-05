var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');
var model = require('../models');

var csrfProtection = csrf();
router.use(csrfProtection);

/* GET users listing. */
router.get('/signup', function(req, res, next){
  res.render('./users/signup', {layout: 'auth', csrfToken: req.csrfToken(), title: 'SignUp ~ Instagram'});
});

router.post('/signup', function(req, res, next){
  model.users.findOne({
    where: {
      username: req.body.username
    }
  }).then(function(user){
    if(!user){
      model.users.create({
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null),
        email: req.body.email,
        fullname: req.body.fullname
      }).then(function(user){
        passport.authenticate('local', {
          failureRedirect:"/users/signup",
          successRedirect: "/"
        })(req, res, next)
      })
    } else {
      res.send("user exists");
    }
  });
});

router.get('/login', function(req, res, next){
  res.render('./users/login', { layout: 'auth', csrfToken: req.csrfToken(), title: 'User Login ~ Instagram' });
});

router.post('/login', passport.authenticate('local', {
  failureRedirect:"/users/login",
  successRedirect: "/"
}));

router.get('/logout', isLoggedIn, function(req, res, next){
  req.session.destroy();
  res.redirect('/users/login');
});

module.exports = router;

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/users/login');
};

function notLoggedIn(req, res, next){
  if(!req.isAuthenticated()){
    return next();
  }
  res.redirect('/users/login');
};
