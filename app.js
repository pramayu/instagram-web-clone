var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var handleHbs = require('express-handlebars');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var model = require('./models');
var bcrypt = require('bcrypt-nodejs');
var flash  = require('connect-flash');
var validator = require('express-validator');
var _ = require('lodash');

var index = require('./routes/index');
var users = require('./routes/users');
var posts = require('./routes/posts');
var relationships = require('./routes/relationships');

var handleBar = require('./config/regHbs');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', handleBar.engine);
app.set('view engine', 'hbs');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: 'this_is_so_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 180 * 60 *1000 }
}));

passport.use(new LocalStrategy(function(username, password, done){
  var hashedPass = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
  model.users.findOne({
    where: {
      username: username
    }
  }).then(function(user, err){
    if(err){
      return done(err);
    }
    if(!user){
      return done(null, false);
    }
    if(!bcrypt.compareSync(password, user.password)){
      return done(null, false);
    }
    return done(null, user);
  })
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  model.users.findById(id).then(function (user) {
    done(null, user);
  });
});

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
  res.locals.current_user = req.user;
  next();
});

app.use('/', index);
app.use('/users', users);
app.use('/posts', posts);
app.use('/relationships', relationships);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
