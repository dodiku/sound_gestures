var waveOne = 0;
var waveOneColor = 1;

var waveTwo = 0;
var waveTwoColor = 1;

var waveThree = 0;
var waveThreeColor = 1;

function setup() {

}


function draw() {
    if (animOne === true) {
      waveOne = waveformOne.value;
      waveOneColor = "rgba(127, 255, 212," + waveOne + ")";
      $('#instr01').css("background-color",waveOneColor);
    }

    if (animTwo === true) {
      waveTwo = waveformTwo.value;
      waveTwoColor = "rgba(245, 245, 220," + waveTwo + ")";
      $('#instr02').css("background-color",waveTwoColor);
    }

    if (animThree === true) {
      waveThree = waveformThree.value;
      waveThreeColor = "rgba(0, 255, 255," + waveThree + ")";
      $('#instr03').css("background-color",waveThreeColor);
    }
}
