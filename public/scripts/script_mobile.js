var socket = io();

function setup(){

}


function draw(){

}


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

$('body').append( "<div class='deviceorientation'></div>" );
$('.deviceorientation').append( "<p style='font-weight:300;'>deviceorientation</p>" );
$('.deviceorientation').append( "<p class='alpha'></p>" );
$('.deviceorientation').append( "<p class='beta'></p>" );
$('.deviceorientation').append( "<p class='gamma'></p>" );
$('.deviceorientation').append( "<p class='absolute'></p>" );
$('.deviceorientation').append( "</br>" );

window.addEventListener("deviceorientation", function(event){
  var orientationArray = handleOrientation(event);
  // console.log(orientationArray);
  socket.emit('orientation', orientationArray);
}, true);
