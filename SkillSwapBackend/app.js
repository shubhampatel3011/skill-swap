var createError = require('http-errors');
var express = require('express');
const cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const skillsRouter = require("./routes/skills");
const swapRouter = require("./routes/swap");
const messageRouter = require("./routes/message");
const reviewRouter = require("./routes/review");
const notificationRouter = require("./routes/notification");
const categoryRouter = require('./routes/category');
const subCategoryRouter = require('./routes/subCategory');
const thirdCategoryRouter = require('./routes/thirdCategory');
require("dotenv").config();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/skills', skillsRouter);
app.use('/swap', swapRouter);
app.use('/message', messageRouter);
app.use('/review', reviewRouter);
app.use('/notification', notificationRouter);
app.use('/category', categoryRouter);
app.use('/subCategory', subCategoryRouter);
app.use('/thirdCategory', thirdCategoryRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
