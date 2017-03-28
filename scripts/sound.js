/*
- 4 intruments running in loops
- changing:
 pitch = global variable
 timiing = loop.interval = "8n";
  velocity == vol

loopone.stop()

loopone.start()

*/
/******************************
instrument configuration constructor
*****************************/
config = function (freq, vol, int){
  this.frequency = freq;
  this.volume = vol;
  this.interval = int;
};


/******************************
intrument one
*****************************/
var instOne = new config ('440', 0.5, 0.5);

var synthOne = new Tone.Synth({
	'oscillator.type' : 'square8',
  'envelope' : {
  	attack : 0.001,
    decay : 0.2,
    sustain : 0
  }
}).toMaster();

var loopOne = new Tone.Loop(function(time){
	//triggered every eighth note.
  synthOne.triggerAttack(instOne.frequency, time, instOne.volume);
	// console.log(time);
}, '4n');
loopOne.humanize = true;

/******************************
intrument two
*****************************/
// things to configure
// synthTwo.envelope.attack
// loopTwo.interval
// frequency
// volume

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
  	attack : 1,
    decay : 2,
    sustain : 0,
    // release : 4
  },
  'filterEnvelope':{
    attack:0.6,
    decay:0.2,
    sustain:0,
    // release:2,
    baseFrequency:100,
    octaves:10,
    exponent:2,
},
}).toMaster();

var loopTwo = new Tone.Loop(function(time){
  synthTwo.triggerAttack(instTwo.frequency, time, instTwo.volume);
}, '4n');
loopTwo.humanize = true;

/******************************
intrument three
*****************************/
// things to configure
// synthTwo.envelope.attack
// loopTwo.interval
// frequency
// volume

var instThree = new config ('110', 0.5, 0.5);
var synthThree = new Tone.PluckSynth().toMaster();
var loopThree = new Tone.Loop(function(time){
  synthThree.triggerAttack(instThree.frequency, time, instThree.volume);
}, '8n');
loopThree.humanize = true;
synthThree.dampening.value = 1500;
synthThree.resonance.value = 15;
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
});

$("#button06").click(function() {
  loopThree.stop();
});

/******************************
transport
*****************************/
Tone.Transport.start();
