import Tone from "tone";
import RecordRTC, { StereoAudioRecorder } from "recordrtc";

const main = async () => {
  const audio = document.querySelector("audio");
  const ctx  = Tone.context;
  const mic = new Tone.UserMedia();
  const dest = ctx.createMediaStreamDestination();
  const recorder = RecordRTC(dest.stream, {
    type: 'audio',
    recorderType: StereoAudioRecorder,
    numberOfAudioChannels: 1
  });
  await mic.open();
  mic.connect(dest);
  recorder.startRecording();
  setTimeout(() => {
    recorder.stopRecording(() => {
      const blob = recorder.getBlob();
      if (audio) {
        audio.src = URL.createObjectURL(blob);
      }
    });
  }, 5000);
};

document.documentElement.addEventListener('mousedown', main);
