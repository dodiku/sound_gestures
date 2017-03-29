var port = process.env.PORT || 3000;

var express = require('express');
var app = express();
var server = app.listen(port);
var Request = require('request');
var io = require('socket.io').listen(server);
var http = require('http');

// *************************
// SETUP
// *************************

app.set("views", __dirname + '/views');
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
app.use(express.static( __dirname + '/public' ));




app.get('/', function(req, res){
  console.log(req.get('User-Agent'));
  console.log('[route] user enters..');
  res.render('index');
});

app.get("*", function(req, res){
	res.send('Ooops.. nothing here.');
});



console.log("App is served on localhost: " + port);

io.on('connection', function(socket){
  console.log('[io] a user connected');

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

});
