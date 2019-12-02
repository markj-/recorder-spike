import Tone from "tone";
import RecordRTC, { StereoAudioRecorder } from "recordrtc";

const record = document.getElementById("record");
const request = document.getElementById("request");

let audio = document.querySelector("audio");

let mic;

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
  mic = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
  audio.srcObject = mic;
  Tone.start();
};

const main = async () => {
  let recorder = RecordRTC(mic, {
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
        mic.stop();
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
