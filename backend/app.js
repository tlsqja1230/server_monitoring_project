var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var osu = require('node-os-utils')
var cpu = osu.cpu
var app = express();

// socket setting start
var server = require('http').createServer(app);
var io = require('socket.io')(server);

let interCpu = new Function()
let interCpuPerData = new Function()
let interWhoami = new Function()
let isInterval = false

let pad =(val)=>{
  return String(val).length === 1? '0'+val : val
}

let dataInterval = () =>{
  // 클라이언트에게 cpuPercentage data 전송
  interCpuPerData = setInterval(() => {
    cpu.usage().then(res => {
      console.log(res)
      let d = new Date()
      
      let cpuPerData = {
          x: `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`,
          y: res
      }
      io.emit('cpuPerData', {cpuPerData : cpuPerData});
    })
  }, 2000);

  // 클라이언트에게 cpu data 전송
  interCpu = setInterval(() => {
    var count = cpu.count()
    io.emit('cpu', {cpu : count})
  }, 2000);

  // 클라이언트에게 whoami data 전송
  interWhoami = setInterval(() => {
    var osCmd = osu.osCmd  
    osCmd.whoami().then(userName => {
      io.emit('whoami', {userName : userName});
    })
  }, 2000);
}

io.on('connection' , function(socket) {
  // interval 없을 경우 등록
  if(!isInterval){
    dataInterval()
    isInterval = true
    console.log('인터벌등록')
  }
  // 접속이 끊어진 경우 처리
  socket.on('disconnect', function(){
    console.log('접속을 해제하였습니다.')
    // 연결된 소켓이 없을 경우 interval 해제
    if(Number(socket.server.httpServer._connections) === 0){
      clearInterval(interCpu);
      clearInterval(interCpuPerData);
      clearInterval(interWhoami);
      isInterval = false
      console.log('인터벌삭제')
    }
  })

  // 오류가 난 경우 처리
  socket.on('error', function(){
    console.log('error:',error)
  })
})
server.listen(3001, function() {
  console.log('socket io server listening on port 3001')
})
// socket setting end

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
