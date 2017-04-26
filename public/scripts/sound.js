/******************************
instrument configuration constructor
*****************************/
config = function (freq, vol, int){
  this.frequency = freq;
  this.volume = vol;
  this.interval = int;
};

/******************************
some animations...
*****************************/
var waveformOne = new Tone.Meter();
var waveformTwo = new Tone.Meter();
var waveformThree = new Tone.Meter();
waveformThree.type = 'signal';

var animOne = false;
var animTwo = false;
var animThree = false;

if (loopOne != 'stopped') {
  animOne = true;
}

if (loopTwo != 'stopped') {
  animTwo = true;
}

if (loopThree != 'stopped') {
  animThree = true;
}




/******************************
sockets -- general (more sockets on each instrument)
*****************************/
var socket = io();

socket.on('instrumentIsOn', function(val){
  if (val === 1) {
    console.log('🐨 [instrument 1] connected');
    $('#instr01').css("background-color","rgba(127, 255, 212, 1)");
    animOne = true;
  } else if (val === 2) {
    console.log('🐯 [instrument 2] connected');
    $('#instr02').css("background-color","rgba(245, 245, 220, 1)");
    animTwo = true;
  } else if (val === 3) {
    console.log('🦁 [instrument 3] connected');
    $('#instr03').css("background-color","rgba(0, 255, 255, 1)");
    animThree = true;
  }
});

/******************************
intrument one
*****************************/

socket.on('confOne', function(array){
  loopOne.start(0.1);
  instOne.frequency = array[1] * 800 + 200;
  loopOne.interval = array[0] * 2;
  instOne.volume = array[3]/2;
});

socket.on('confOneDisconnect', function(){
  loopOne.stop();
  $('#instr01').css("background-color","Azure");
  console.log('🐨 [instrument 1] disconnected');
  animOne = false;
});

var instOne = new config ('440', 0.5, 0.5);

var synthOne = new Tone.Synth({
	'oscillator.type' : 'square8',
  'envelope' : {
  	attack : 0.001,
    decay : 0.2,
    sustain : 0
  }
}).toMaster().connect(waveformOne);

var loopOne = new Tone.Loop(function(time){
  synthOne.triggerAttack(instOne.frequency, time, instOne.volume);
}, '4n');
loopOne.humanize = true;

/******************************
intrument two
*****************************/
socket.on('confTwo', function(array){
  loopTwo.start(0.1);
  instTwo.frequency = array[1] * 220 + 100;
  loopTwo.interval = array[0] * 0.1;
  synthTwo.envelope.attack = array[2];
  instTwo.volume = array[3]/2;
});

socket.on('confTwoDisconnect', function(){
  loopTwo.stop();
  $('#instr02').css("background-color","Azure");
  console.log('🐯 [instrument 2] disconnected');
  animTwo = false;
});


var instTwo = new config ('440', 0.5, 0.5);

var synthTwo = new Tone.MonoSynth({
  'detune' : 10,
	'oscillator' : {
  	type : "fatsawtooth10",
  },
  'filter' : {
    type:"peaking",
  },
	'envelope' : {
  	attack : 0.1,
    decay : 0.4,
    sustain : 0,
    // release : 4
  },
  'filterEnvelope':{
    attack:0.2,
    decay:0.2,
    sustain:0,
    // release:2,
    baseFrequency:100,
    octaves:10,
    exponent:2,
},
}).toMaster().connect(waveformTwo);

var loopTwo = new Tone.Loop(function(time){
  synthTwo.triggerAttack(instTwo.frequency, time, instTwo.volume);
}, '0.1');
// loopTwo.humanize = true;

/******************************
intrument three
*****************************/
socket.on('confThree', function(array){
  loopThree.start(0.1);
  synthThree.dampening.value = array[1] * 3000 + 1000;
  synthThree.resonance.value = array[0] * 0.1 + 0.97;
  synthThree.attackNoise = array[2];
  synthThree.volume.value = array[3]*60-60;
});

socket.on('confThreeDisconnect', function(){
  loopThree.stop();
  synthThree.resonance.value = 0;
  $('#instr03').css("background-color","Azure");
  console.log('🦁 [instrument 3] disconnected');
  animThree = false;
});

var instThree = new config ('110', 0.5, 0.5);
var synthThree = new Tone.PluckSynth().toMaster().connect(waveformThree);
var loopThree = new Tone.Loop(function(time){
  synthThree.triggerAttack(instThree.frequency, time);
}, '8n');
loopThree.humanize = true;
synthThree.dampening.value = 1500;
synthThree.resonance.value = 1;
synthThree.attackNoise = 0.5;



/******************************
event listeners
*****************************/
$("#button01").click(function() {
  loopOne.start(0.1);
});

$("#button02").click(function() {
  loopOne.stop();
});


$("#button03").click(function() {
  loopTwo.start(0.1);
});

$("#button04").click(function() {
  loopTwo.stop();
});


$("#button05").click(function() {
  loopThree.start(0.1);
  synthThree.resonance.value = 15;
});

$("#button06").click(function() {
  loopThree.stop();
  synthThree.resonance.value = 0;
});

/******************************
transport
*****************************/
Tone.Transport.start();

/******************************
a function that returns true is the user uses a mobile device
*****************************/
function isMobile() {
  var mobile = (navigator.userAgent.toLowerCase().includes('iphone') ||
              navigator.userAgent.toLowerCase().includes('android') ||
              navigator.userAgent.toLowerCase().includes('ipad') ||
              navigator.userAgent.toLowerCase().includes('ipod')
  );

  return mobile;
}
