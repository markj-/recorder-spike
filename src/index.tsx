import Tone from "tone";
import RecordRTC from "recordrtc";

const countdownEl = document.getElementById("countdown");

let mic;
let players;
let dest;
let metronome;

const setVolume = (volume: number) => {
  const volumeNode = new Tone.Volume(volume);
  Tone.Master.chain(volumeNode);
};

const toggleMetronome = () => {
  metronome.mute = !metronome.mute;
};

const record = async (index: number) => {
  if (!mic) {
    mic = new Tone.UserMedia();
    await mic.open();
    dest = Tone.context.createMediaStreamDestination();
    mic.connect(dest);
    await Tone.start();
  }

  let recorder = RecordRTC(dest.stream, {
    type: 'audio'
  });

  let count = 4;
  const countdown = new Tone.Event(() => {
    countdownEl.innerHTML = String(count);
    if (count === 1) {
      countdown.dispose();
      Tone.Transport.scheduleOnce(() => {
        countdownEl.innerHTML = "";
        setVolume(-16);
        recorder.startRecording();
        Tone.Transport.scheduleOnce(() => {
          recorder.stopRecording(() => {
            setVolume(0);
            const blob = recorder.getBlob();
            const player = players[index];
            player.load(URL.createObjectURL(blob), () => {
              player.toMaster().sync().start();
            });
            recorder.destroy();
            recorder = null;
          });
        }, 0);
      }, 0);
    }
    count = count - 1;
  });
  countdown.loop = 4;
  countdown.loopEnd = '4n';

  Tone.Transport.scheduleOnce(() => {
    countdown.start();
  }, '1m');

  Tone.Transport.start();
};

const main = () => {
  const recordOne = document.getElementById("record-one");
  const recordTwo = document.getElementById("record-two");
  const recordThree = document.getElementById("record-three");
  const recordFour = document.getElementById("record-four");
  const toggleMetronomeEl = document.getElementById("toggle-metronome");

  if (recordOne) {
    recordOne.addEventListener('click', () => record(0));
  }

  if (recordTwo) {
    recordTwo.addEventListener('click', () => record(1));
  }

  if (recordThree) {
    recordThree.addEventListener('click', () => record(2));
  }

  if (recordFour) {
    recordFour.addEventListener('click', () => record(3));
  }

  if (toggleMetronomeEl) {
    toggleMetronomeEl.addEventListener('click', toggleMetronome);
  }

  Tone.context.latencyHint = "fastest";
  Tone.Transport.bpm.value = 120;
  Tone.Transport.loop = true;
  Tone.Transport.loopStart = '0';
  Tone.Transport.loopEnd = '2m';

  metronome = new Tone.Player("/woodblock.wav").toMaster();
  Tone.Transport.scheduleRepeat((time: number) => {
    metronome.start(time);
  }, "4n");

  players = [1, 2, 3, 4].map(() => new Tone.Player({
    loop: true,
    url: null
  }));
};

main();
