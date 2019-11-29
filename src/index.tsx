import Tone from "tone";

const record = document.getElementById("record");
const enable = document.getElementById("enable");
const log = document.getElementById("log");

const enableAudio = async () => {
  await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
}

const main = async () => {
  // @ts-ignore
  const mic = new Tone.UserMedia();
  const fft = new Tone.FFT();
  mic.open().then(function(){
    mic.connect(fft);
    setInterval(() => {
      if (log) {
        log.innerText = fft.getValue();
      }  
    }, 100);
  });
};

if (record) {
  record.addEventListener('click', main);
}

if (enable) {
  enable.addEventListener('click', enableAudio);
}
