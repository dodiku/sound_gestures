

var socket = io();
socket.emit('mobile', isMobile());

socket.on('orientationOne', function(array){
  console.log('orientationOne');
  console.log(array);
});

socket.on('hi', function(hi){
  console.log(hi);
});

console.log('socket');
