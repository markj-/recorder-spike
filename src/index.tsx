import Tone from "tone";
import RecordRTC, { StereoAudioRecorder } from "recordrtc";

const record = document.getElementById("record");
const log = document.getElementById("log");
const audio = document.querySelector("audio");

const main = async () => {
  // @ts-ignore
  const mic = new Tone.UserMedia();
  const fft = new Tone.FFT();
  const dest = Tone.context.createMediaStreamDestination();
  mic.fan(fft, dest);
  Tone.start();
  await mic.open();

  setInterval(() => {
    if (log) {
      log.innerHTML = fft.getValue();
    }
  }, 100);

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
