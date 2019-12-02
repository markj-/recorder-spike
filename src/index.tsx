import Tone from "tone";
import RecordRTC, { StereoAudioRecorder } from "recordrtc";

const record = document.getElementById("record");
const request = document.getElementById("request");
const log = document.getElementById("log");
const audio = document.querySelector("audio");

let mic;
let dest;

const requestMicrophone = async () => {
  await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
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
    numberOfAudioChannels: 1
  });
  recorder.startRecording();

  setTimeout(() => {
    recorder.stopRecording(function() {
      const blob = recorder.getBlob();
      if (audio) {
        audio.src = URL.createObjectURL(blob);
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
