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



// *************************
// routes
// *************************
app.get('/', function(req, res){

  console.log('[route] user enters..');

  var userAgent = req.get('User-Agent');
  console.log(userAgent.toLowerCase());
  console.log(userAgent.toLowerCase());
  if (isMobile(userAgent) === true) {
    console.log('user is on mobile');
    res.render('mobile');
  } else {
    console.log('user is on desktop');
    res.render('index');
  }

});

app.get("*", function(req, res){
	res.send('Ooops.. nothing here.');
});


// *************************
// sockets
// *************************
console.log("App is served on localhost: " + port);

io.on('connection', function(socket){
  console.log('[io] a user connected');
  socket.emit('hi', 'hi');

  socket.on('disconnect', function(){
    console.log('[io] user disconnected');
  });

  socket.on('mobile', function(mobile){
    if (mobile === true){
      console.log('[io] user is no mobile]');
    } else {
      console.log('[io] user is no desktop');
    }
  });

  socket.on('orientation', function(array){
    console.log(array);
    io.emit('orientationOne', array);
  });

});


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
