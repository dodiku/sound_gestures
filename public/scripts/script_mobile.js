var socket = io();

var title = $('.id').text();
var id = title.charAt(title.length-1);
id = parseInt(id);

socket.emit('registerInstument', id);


var volume = 1;
function handleOrientation(event) {

  var array = [];

  var absolute = event.absolute;
  var alpha    = event.alpha;
  var beta     = event.beta;
  var gamma    = event.gamma;

  $(".alpha").text("alpha (z axis, 0 to 360): " + alpha);
  $(".beta").text("beta (x axis, -180 to 180): " + beta);
  $(".gamma").text("gamma (y axis, -90 to 90): " + gamma);
  $(".absolute").text("absolute: " + absolute);

  array.push( Math.round(alpha)/360 );
  array.push( (Math.round(beta)+180)/360 );
  array.push( (Math.round(gamma)+90)/180 );

  return array;
}


$( "#volume" ).change(function() {
  volume = $('#volume').val();
});

window.addEventListener("deviceorientation", function(event){
  var orientationArray = handleOrientation(event);
  orientationArray.push(parseFloat(volume));
  orientationArray.push(id);
  socket.emit('orientation', orientationArray);
}, true);
