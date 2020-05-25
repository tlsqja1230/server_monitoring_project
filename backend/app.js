var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var osu = require('node-os-utils')
var cpu = osu.cpu
var app = express();

// socket setting
var server = require('http').createServer(app);
var io = require('socket.io')(server);

let interCpu = new Function()
let interCpuPercentage = new Function()
let interWhoami = new Function()
io.on('connection' , function(socket) {
  socket.on('cpu', function(data){
    // 클라이언트에게 cpu data 전송
    interCpu = setInterval(() => {
      var count = cpu.count()
      io.emit('cpu', {cpu : count})
    }, 2000);
  });

  socket.on('cpuPercentage', function(data){
    // 클라이언트에게 cpuPercentage data 전송
    interCpuPercentage = setInterval(() => {
      cpu.usage().then(cpuPercentage => {
        io.emit('cpuPercentage', {cpuPercentage : cpuPercentage});
      })
    }, 2000);
  });

  socket.on('whoami', function(data){
    // 클라이언트에게 whoami data 전송
    interWhoami = setInterval(() => {
      var osCmd = osu.osCmd  
      osCmd.whoami().then(userName => {
        io.emit('whoami', {userName : userName});
      })
    }, 2000);
  });

  // 접속이 끊어진 경우 처리
  socket.on('disconnect', function(){
    console.log('접속을 해제하였습니다.')
    // interval 해제
    clearInterval(interCpu);
    clearInterval(interCpuPercentage);
    clearInterval(interWhoami);
  })

  // 오류가 난 경우 처리
  socket.on('error', function(){
    console.log('error:',error)
  })
})
server.listen(3001, function() {
  console.log('socket io server listening on port 3001')
})


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
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
