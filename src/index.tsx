import Tone from "tone";
import RecordRTC, { StereoAudioRecorder } from "recordrtc";

const record = document.getElementById("record");
const audio = document.querySelector("audio");

const main = async () => {
  const mic = new Tone.UserMedia();
  const dest = Tone.context.createMediaStreamDestination();
  await mic.open();
  mic.connect(dest);
  Tone.start();

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
