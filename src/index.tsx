import Tone from "tone";
// import RecordRTC, { StereoAudioRecorder } from "recordrtc";

const request = async () => {
  await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
};
const main = async () => {
  
  // const ctx  = Tone.context;
  const mic = new Tone.UserMedia();
  await mic.open();
  mic.toMaster();
  // const dest = ctx.createMediaStreamDestination();
  // const recorder = RecordRTC(dest.stream, {
  //   type: 'audio',
  //   recorderType: StereoAudioRecorder,
  //   numberOfAudioChannels: 2,
  //   checkForInactiveTracks: true,
  //   bufferSize: 4096
  // });
  // await mic.open();
  // mic.connect(dest);
  // recorder.startRecording();
  // setTimeout(() => {
  //   recorder.stopRecording(() => {
  //     const blob = recorder.getBlob();
  //     const audio = document.createElement('audio');
  //     if (audio) {
  //       audio.src = URL.createObjectURL(blob);
  //       audio.controls = true;
  //       document.body.appendChild(audio);
  //     }
  //   });
  // }, 5000);
};

const requestMic = document.getElementById("request-mic")
const record = document.getElementById("record");

if (requestMic) {
  requestMic.addEventListener('click', request);
}

if (record) {
  record.addEventListener('click', main);
}
