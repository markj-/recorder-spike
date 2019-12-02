import Tone from "tone";

const record = document.getElementById("record");
const log = document.getElementById("log");

const main = async () => {
  // @ts-ignore
  const mic = new Tone.UserMedia();
  const fft = new Tone.FFT();
  Tone.start();
  await mic.open();
  mic.connect(fft);
  setInterval(() => {
    if (log) {
      log.innerText = fft.getValue();
    }  
  }, 100);
};

if (record) {
  record.addEventListener('click', main);
}
