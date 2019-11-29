import Tone from "tone";

var record = document.getElementById("record");
var log = document.getElementById("log");

var main = function() {
  // @ts-ignore
  navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    .then(function() {
      var mic = new Tone.UserMedia();
      var fft = new Tone.FFT();
      mic.open().then(function(){
        mic.connect(fft);
        setInterval(() => {
          if (log) {
            log.innerText = fft.getValue();
          }  
        }, 100);
      });
      Tone.start();
    });
};

if (record) {
  record.addEventListener('click', main);
}
