var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// socket setting
var server = require('http').createServer(app);
var io = require('socket.io')(server);
io.on('connection' , function(socket) {
  console.log('Connect from Client: '+socket)
  socket.on('test', function(data){
      console.log('message from Client: '+data.message)
      // 클라이언트에게 메시지를 전송
      io.emit('return', '서버에서보내는 메세지.');
  });
})
server.listen(3001, function() {
  console.log('socket io server listening on port 3001')
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
