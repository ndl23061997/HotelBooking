var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var passport = require('passport');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var auth = require('./routes/auth')
// Khởi tại các router
var indexRouter = require('./routes/index/index');
// Admin
var adminRouter = require('./routes/admin/admin');
// var roomRouter = require('./routes/admin/room/room')
//
var loginRouter = require('./routes/login/login')
var apiRouter = require('./routes/api/api')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// Midleware
app.use(flash());
//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'uploads')));

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'long dep trai',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false , maxAge : 1000*60 }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// Setup Routers
app.use('/user', auth.checkLoginUser, indexRouter);
// Router admin
app.use('/admin', auth.checkLoginAdmin,  adminRouter);
// app.use('/admin/room', roomRouter);
app.use('/login', loginRouter);
app.use('/api', apiRouter);
// loadimage
app.get('/uploads/:file', (req, res) => {
  let filename = req.params.file;
  res.sendFile(path.join(__dirname, 'uploads', filename))
})
// Logout out
app.get('/logout', (req, res) => {
  req.logOut();
  res.redirect('/login');
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404, 'Không tìm thấy trang yêu cầu'));
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
