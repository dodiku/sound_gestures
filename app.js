var port = process.env.PORT || 3000;

var express = require('express');
var app = express();
var server = app.listen(port);
var Request = require('request');
var io = require('socket.io').listen(server);
var http = require('http');

// *************************
// setup
// *************************
app.set("views", __dirname + '/views');
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
app.use(express.static( __dirname + '/public' ));


console.log("[👮🏻  node]: App is served on localhost: " + port + '\n');


// *************************
// instruments
// *************************
var mobileInstruments = [false, false, false];
var currentUser;


// *************************
// routes
// *************************
app.get('/', function(req, res){

  var userAgent = req.get('User-Agent');

  if (isMobile(userAgent) === true) {
    console.log('[👮  router]: 📱  user is connected\n');
    res.render('wait');

  } else {
    console.log('[👮  router]: 💻  user is connected\n');
    res.render('index');
  }

});

app.get('/mobile00', function(req, res){
  res.render('mobile00');
});

app.get('/mobile01', function(req, res){
  res.render('mobile01');
});

app.get('/mobile02', function(req, res){
  res.render('mobile02');
});

app.get('/mobile03', function(req, res){
  res.render('mobile03');
});

app.get('/mobile_na', function(req, res){
  res.render('mobile_na');
});

app.get("*", function(req, res){
	res.send('Ooops.. nothing here.');
});

// *************************
// sockets
// *************************

io.on('connection', function(socket){

  socket.on('isInstrument', function(val){
    var instr = getRandomInstrument();

    // no instrument is available
    if (instr === -1 || instr === undefined) {
      console.log('[🌀  socket]: 📱 👎  all instruments are busy\n');
      socket.emit('instrumentNotAvailable');

    } else {
      console.log('[🌀  socket]: 📱 👍  there are available instruments');
      console.log('[🌀  socket]: instruments status is: ' + mobileInstruments);
      var view = '/mobile0' + instr ;
      console.log('[🌀  socket]: user redirected to ' + view +  ' 🚀\n');
      socket.emit('instrumentAvailable', view);
    }
  });


  socket.on('registerInstument', function(id){
    console.log('[🌀  socket]: ' + socket.id + ' was assinged to instrument ' + (id-1));
    mobileInstruments[id-1] = socket.id;
    console.log('[🌀  socket]: instruments status is: ' + mobileInstruments + '\n');
    io.emit('instrumentIsOn', id);
  });

  socket.on('orientation', function(array){
    var id = array.pop();
    if (id === 1){
      io.emit('confOne', array);
    } else if (id === 2) {
      io.emit('confTwo', array);
    } else if (id === 3) {
      io.emit('confThree', array);
    }
  });

  socket.on('disconnect', function(){

    console.log('[🌀  socket]: ' + socket.id + ' disconnected');
    if (mobileInstruments.includes(socket.id)){
      var dis = mobileInstruments.indexOf(socket.id);
      if (dis === 0){
        io.emit('confOneDisconnect');
      } else if (dis === 1) {
        io.emit('confTwoDisconnect');
      } else if (dis === 2) {
        io.emit('confThreeDisconnect');
      }
      releaseIntrument(socket.id);
    }

  });

  console.log('[🌀  socket]: total number of connected users == ' + Object.keys(io.sockets.clients().connected).length + '\n');
}); // end of sockets


// *************************
// functions
// *************************
function isMobile(userAgent) {
  var mobile = (userAgent.toLowerCase().includes('iphone') ||
                userAgent.toLowerCase().includes('android') ||
                userAgent.toLowerCase().includes('ipad') ||
                userAgent.toLowerCase().includes('ipod')
  );

  return mobile;
}

function getRandomInstrument(){

  var availableInstruments = [];
  for (var i=0; i<mobileInstruments.length; i++){
    if (mobileInstruments[i] === false) {
      availableInstruments.push(i);
    }
  }
  if (availableInstruments === []) {
    return -1;
  } else {
    var index = Math.floor(Math.random() * (availableInstruments.length - 0)) + 0;
    var instrNumber = availableInstruments[index];
    return (instrNumber);
  }

}

function releaseIntrument(id) {
  var inst = mobileInstruments.indexOf(id);
  mobileInstruments[inst] = false;
  console.log('[🤖  function]: instruments status is: ' + mobileInstruments + '\n');
}
