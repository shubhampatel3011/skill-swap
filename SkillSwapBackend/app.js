require("dotenv").config();

var createError = require('http-errors');
var express = require('express');
const cors = require('cors');
const path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const skillsRouter = require("./routes/skills");
const swapRouter = require("./routes/swap");
const messageRouter = require("./routes/message");
const reviewRouter = require("./routes/review");
const feedbackRouter = require("./routes/feedback");
const notificationRouter = require("./routes/notification");
const categoryRouter = require('./routes/category');
const subCategoryRouter = require('./routes/subCategory');
const thirdCategoryRouter = require('./routes/thirdCategory');

var http = require('http');
const { Server } = require("socket.io");
const messageTbl = require("./Models/messageTbl");

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
app.use('/feedback', feedbackRouter);
app.use('/notification', notificationRouter);
app.use('/category', categoryRouter);
app.use('/subCategory', subCategoryRouter);
app.use('/thirdCategory', thirdCategoryRouter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Helper function to setup Socket.IO on an HTTP server instance
function setupSocketIO(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    }
  });

  io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);
    socket.on("joinRoom", (swapId) => {
      socket.join(`swap_${swapId}`);
      console.log(`Socket ${socket.id} joined room swap_${swapId}`);
    });

    socket.on("sendMessage", async (data) => {
      try {
        const db = new messageTbl();
        const result = await db.AddMessage(data);
        const broadcastData = {
          ...data,
          messageId: result?.insertId || Date.now(),
          createdAt: new Date().toISOString(),
        };
        io.to(`swap_${data.swapId}`).emit("receiveMessage", broadcastData);
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("disconnect", () => {
      console.log("User Disconnected", socket.id);
    });
  });

  return io;
}

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

// If app.js is executed directly (e.g. node app.js or nodemon app.js)
if (require.main === module) {
  const port = process.env.PORT || 3000;
  const server = http.createServer(app);
  setupSocketIO(server);
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

app.setupSocketIO = setupSocketIO;

module.exports = app;
