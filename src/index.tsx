import RecordRTC, { StereoAudioRecorder } from "recordrtc";

const main = async () => {
  // @ts-ignore
  const ctx = new (AudioContext || webkitAudioContext)();
  const mic = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
  const src = ctx.createMediaStreamSource(mic);
  const dest = ctx.createMediaStreamDestination();
  const recorder = RecordRTC(dest.stream, {
    type: 'audio',
    recorderType: StereoAudioRecorder,
    numberOfAudioChannels: 2,
    checkForInactiveTracks: true,
    bufferSize: 4096
  });
  src.connect(dest);
  recorder.startRecording();
  setTimeout(() => {
    recorder.stopRecording(() => {
      const blob = recorder.getBlob();
      const audio = document.createElement('audio');
      if (audio) {
        audio.src = URL.createObjectURL(blob);
        audio.controls = true;
        document.body.appendChild(audio);
      }
    });
  }, 5000);
};

const record = document.getElementById("record");

if (record) {
  record.addEventListener('click', main);
}
