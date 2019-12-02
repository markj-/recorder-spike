import RecordRTC, { StereoAudioRecorder } from "recordrtc";

var microphone;
var recorder;
var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

var audio = document.querySelector('audio');
var btnStartRecording = document.getElementById('btn-start-recording') as HTMLButtonElement;
var btnStopRecording = document.getElementById('btn-stop-recording') as HTMLButtonElement;
var btnReleaseMicrophone = document.querySelector('#btn-release-microphone') as HTMLButtonElement;

function captureMicrophone(callback) {
  btnReleaseMicrophone.disabled = false;
  if(microphone) {
      callback(microphone);
      return;
  }
  navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false
    }
  }).then(function(mic) {
      callback(mic);
  }).catch(function(error) {
      alert('Unable to capture your microphone. Please check console logs.');
      console.error(error);
  });
}

function replaceAudio(src?: string) {
  var newAudio = document.createElement('audio');
  newAudio.controls = true;
  newAudio.autoplay = true;
  if(src) {
      newAudio.src = src;
  }
  
  var parentNode = audio.parentNode as HTMLElement;
  parentNode.innerHTML = '';
  parentNode.appendChild(newAudio);
  audio = newAudio;
}

function stopRecordingCallback() {
  replaceAudio(URL.createObjectURL(recorder.getBlob()));
  btnStartRecording.disabled = false;
  setTimeout(function() {
      if(!audio.paused) return;
      setTimeout(function() {
          if(!audio.paused) return;
          audio.play();
      }, 1000);
      
      audio.play();
  }, 300);
  audio.play();
  if(isSafari) {
      click(btnReleaseMicrophone);
  }
}

btnStartRecording.onclick = function() {
  btnStartRecording.disabled = true;
  btnStartRecording.style.border = '';
  btnStartRecording.style.fontSize = '';
  if (!microphone) {
      captureMicrophone(function(mic) {
          microphone = mic;
          if(isSafari) {
              replaceAudio();
              audio.muted = true;
              audio.srcObject = microphone;
              btnStartRecording.disabled = false;
              btnStartRecording.style.border = '1px solid red';
              btnStartRecording.style.fontSize = '150%';
              alert('Please click startRecording button again. First time we tried to access your microphone. Now we will record it.');
              return;
          }
          click(btnStartRecording);
      });
      return;
  }
  replaceAudio();
  audio.muted = true;
  audio.srcObject = microphone;
  var options: Partial<{
    type: string;
    numberOfAudioChannels: number;
    checkForInactiveTracks: boolean;
    bufferSize: number;
    recorderType: any;
    sampleRate: number;
  }> = {
      type: 'audio',
      numberOfAudioChannels: 2,
      checkForInactiveTracks: true,
      bufferSize: 16384
  };
  if(isSafari) {
      options.recorderType = StereoAudioRecorder;
  }
  if(navigator.platform && navigator.platform.toString().toLowerCase().indexOf('win') === -1) {
      options.sampleRate = 48000; // or 44100 or remove this line for default
  }
  if(isSafari) {
      options.sampleRate = 44100;
      options.bufferSize = 4096;
      options.numberOfAudioChannels = 2;
  }
  if(recorder) {
      recorder.destroy();
      recorder = null;
  }
  recorder = RecordRTC(microphone, options);
  recorder.startRecording();
  btnStopRecording.disabled = false;
};

btnStopRecording.onclick = function() {
  btnStopRecording.disabled = true;
  recorder.stopRecording(stopRecordingCallback);
};

btnReleaseMicrophone.onclick = function() {
  btnReleaseMicrophone.disabled = true;
  btnStartRecording.disabled = false;
  if(microphone) {
      microphone.stop();
      microphone = null;
  }
  if(recorder) {
      // click(btnStopRecording);
  }
};

function click(el) {
  el.disabled = false; // make sure that element is not disabled
  var evt = document.createEvent('Event');
  evt.initEvent('click', true, true);
  el.dispatchEvent(evt);
}
