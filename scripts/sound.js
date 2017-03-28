/*
- 4 intruments running in loops
- changing:
 pitch = global variable
 timiing = loop.interval = "8n";
  velocity == vol

loopone.stop()

loopone.start()

*/

var freqOne = '440';
var volOne = 0.5;

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
  synthOne.triggerAttack(freqOne, time, volOne);
	// console.log(time);
}, '4n');

loopOne.humanize = true;

$("#button01").click(function() {
  loopOne.start(0.1);
});

$("#button02").click(function() {
  loopOne.stop();
});







Tone.Transport.start();


// //use an array of objects as long as the object has a "time" attribute
// var part = new Tone.Part(function(time, value){
// 	//the value is an object which contains both the note and the velocity
// 	synth.triggerAttackRelease(value.note, "8n", time, value.velocity);
// }, [{"time" : 0, "note" : "C3", "velocity": 0.9},
// 	   {"time" : "0:2", "note" : "C4", "velocity": 0.5}
// ]).start(0);
//
// part.loopStart();
