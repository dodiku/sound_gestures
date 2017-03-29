

var socket = io();
socket.emit('mobile', isMobile());

console.log('socket');
