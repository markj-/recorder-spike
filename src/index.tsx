import Tone from "tone";

const main = async () => {
  // @ts-ignore
  const mic = new Tone.UserMedia();
  mic.open().then(function(){
    alert(mic.state);
  });
};

const record = document.getElementById("record");

if (record) {
  record.addEventListener('click', main);
}
