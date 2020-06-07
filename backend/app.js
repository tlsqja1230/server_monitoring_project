const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();

// socket, os-utils setting start
const osu = require('node-os-utils')
const cpu = osu.cpu
const drive = osu.drive
const proc = osu.proc
const mem = osu.mem

const server = require('http').createServer(app);
const io = require('socket.io')(server);

const pad =(val)=>{
  return String(val).length === 1? '0'+val : val
}
let interData = new Function()
let isInterval = false

let dataInterval = () =>{
  interData = setInterval(() => {
    let date = new Date()
    let time = `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
    // cpu data
    cpu.usage().then(res => {
      let cpuUsage = {
          x: time,
          y: res
      }
      console.log('cpuUsage',cpuUsage)
      io.emit('cpuUsage', {cpuUsage : cpuUsage});
    })

    // memory data
    mem.info().then(res => {
      io.emit('memoryPer', {memoryPer: (100-res.freeMemPercentage).toFixed(2)})
      console.log('memoryPer',(100-res.freeMemPercentage).toFixed(2))
      
      let memorySpace = {
        totalMemMb: res.totalMemMb,
        usedMemMb: res.usedMemMb,
        freeMemMb: res.freeMemMb,
        time: time
      }
      console.log('memorySpace',memorySpace)
      io.emit('memorySpace', {memorySpace: memorySpace})
    })

    // drive data
    drive.info().then(res => {
      console.log('interDrive',res)
      let driveSpace = {
        totalGb: res.totalGb,
        usedGb: res.usedGb,
        freeGb: res.freeGb
      }
      io.emit('driveData', {drivePer: res.usedPercentage, driveSpace: driveSpace})
    })

    // process data
    proc.totalProcesses().then(res=>{
      let processCnt = {
        x: time,
        y: res
      }
      console.log('process',processCnt)
      io.emit('processCnt', {processCnt: processCnt})
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
      clearInterval(interData);
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
// socket, os-utils setting end

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
