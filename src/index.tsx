import Tone from "tone";
import RecordRTC, { StereoAudioRecorder } from "recordrtc";

const record = document.getElementById("record");
const request = document.getElementById("request");

let audio = document.querySelector("audio");

let mic;
let dest;

const requestMicrophone = async () => {
  mic = new Tone.UserMedia();
  dest = Tone.context.createMediaStreamDestination();
  await mic.open();
  mic.connect(dest);
  Tone.start();
  console.log('started');
};

const main = () => {
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
