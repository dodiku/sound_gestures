var socket = io();
socket.emit('isInstrument', 'hi');

socket.on('instrumentAvailable', function(val){
  console.log(val);
  window.location.href = (val);
});

socket.on('instrumentNotAvailable', function(){
  window.location.href = ("/mobile_na");
});
