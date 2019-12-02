import Tone from "tone";
import RecordRTC, { StereoAudioRecorder } from "recordrtc";

const record = document.getElementById("record");
const request = document.getElementById("request");
const log = document.getElementById("log");

let audio = document.querySelector("audio");

let mic;
let dest;


const replaceAudio = (src) => {
  var newAudio = document.createElement('audio');
  newAudio.controls = true;
  newAudio.autoplay = true;
  if(src) {
      newAudio.src = src;
  }
  
  var parentNode = audio.parentNode;
  parentNode.removeChild(audio);
  parentNode.appendChild(newAudio);
  audio = newAudio;
}

const requestMicrophone = async () => {
  Tone.start();
  mic = new Tone.UserMedia();
  await mic.open();
  dest = Tone.context.createMediaStreamDestination();
  const fft = new Tone.FFT();
  mic.fan(fft, dest);
  
  setInterval(() => {
    if (log) {
      log.innerHTML = fft.getValue();
    }
  }, 100);
};

const main = async () => {
  let recorder = RecordRTC(dest.stream, {
    type: 'audio',
    recorderType: StereoAudioRecorder,
    numberOfAudioChannels: 2,
    sampleRate: 44100,
    bufferSize: 4096
  });
  recorder.startRecording();

  setTimeout(() => {
    recorder.stopRecording(function() {
      const blob = recorder.getBlob();
      if (audio) {
        replaceAudio(URL.createObjectURL(blob));
      }
    });
  }, 3000);
};

if (record) {
  record.addEventListener('click', main);
}

if (request) {
  request.addEventListener('click', requestMicrophone);
}
