require('dotenv').config();

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/config/config.json')[env];

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var session = require('express-session');
const i18n = require('./i18n');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


// DB 동기화
let sequelize = require('./models/index').sequelize;
sequelize.sync()


var app = express();


// 헤더 정보 숨기기
app.disable('x-powered-by');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

if (env == 'development') app.use(logger('dev'));
else app.use(logger('combined'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



// 세션세팅
const sessionOption = {
  secret: process.env.SECRET_KEY,
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: process.env.ACCESS_MAXAGE * 60 * 1000,
  },
}

app.use(session(sessionOption));


// i18n - cookieParser 다음에 마운트 할 것
app.use(i18n);

// 언어 설정
app.get('/en', (req, res) => {
  res.cookie('lang', 'en');
  res.redirect('back');
});
app.get('/ko', (req, res) => {
  res.cookie('lang', 'ko');
  res.redirect('back');
});

// routing
app.use('/users', usersRouter);
app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
