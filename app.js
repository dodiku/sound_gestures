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


console.log("App is served on localhost: " + port);


// *************************
// instruments
// *************************
var mobileInstruments = [false, false, false];
var currentUser;


// *************************
// routes
// *************************

// console.log(user + ' IT WORKS!!!');
// var instrument = 0;

app.get('/', function(req, res){

  var userAgent = req.get('User-Agent');

  if (isMobile(userAgent) === true) {
    console.log('[👮  router]: user is connected from mobile  📱');
    res.render('wait');

  } else {
    console.log('[👮  router]: user is connected from desktop  💻');
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

    console.log('[debug]:');
    console.log(io.sockets.clients());

    var instr = getRandomInstrument();

    if (instr === -1 || instr === undefined) {
      console.log('[🌀  socket]: user ' + socket.id + ' is connected from mobile, but all instruments are busy  😢');
      socket.emit('instrumentNotAvailable');
    } else {
      var view = '/mobile0' + instr ;
      console.log('[🌀  socket]: user ' + socket.id + ' is connected from mobile, and is being redirected to ' + view +  ' 🚀');
      mobileInstruments[instr] = socket.id; // assigning the instrument to the user
      console.log('[🌀  socket]: instruments status is: ');
      console.log(mobileInstruments);
      socket.emit('instrumentAvailable', view);
    }

  });

  socket.on('disconnect', function(){
    console.log('[🌀  socket]: ' + socket.id + ' disconnected');
    var userAgent = socket.request.headers['user-agent'];
    // if (isMobile(userAgent) === true) {
      if (mobileInstruments.includes(socket.id)){
        console.log('0909090 disconnected');
        var dis = mobileInstruments.indexOf(socket.id);
        if (dis === 0){
          console.log('0909090 disconnected + sent');
          io.emit('confOneDisconnect');
        } else if (dis === 1) {
          io.emit('confTwoDisconnect');
        } else if (dis === 1) {
          io.emit('confThreeDisconnect');
        }
        releaseIntrument(socket.id);
      }
    // }
  });

  socket.on('orientation', function(array){
    // console.log(array);
    var id = array.pop();
    if (id === 1){
      io.emit('confOne', array);
    } else if (id === 2) {
      io.emit('confTwo', array);
    } else if (id === 3) {
      io.emit('confThree', array);
    }
  });

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


function getIntrument(id){
  var inst;
  for (var i=0; i<mobileInstruments.length; i++){
    if (mobileInstruments[i] === 0) {
      mobileInstruments[i] = id;
      inst = i;
      break;
    }
  }
  // console.log('instruments status is: ');
  // console.log(mobileInstruments);
  return inst;
}

function getRandomInstrument(){

  var availableInstruments = [];
  for (var i=0; i<mobileInstruments.length; i++){
    if (mobileInstruments[i] === false) {
      availableInstruments.push(i);
    }
  }
    // console.log('this is availableInstruments: ');
    // console.log(availableInstruments);
  if (availableInstruments === []) {
    return -1;
  } else {
    var index = Math.floor(Math.random() * (availableInstruments.length - 0)) + 0;
    // console.log('this is index: ' + index);
    // console.log('this is the return value: ' + availableInstruments[index]);
    return (availableInstruments[index]);
  }

}

function releaseIntrument(id) {
  var inst = mobileInstruments.indexOf(id);
  mobileInstruments[inst] = false;
  console.log('[🤖  function]: instruments status is: ');
  console.log(mobileInstruments);
}
