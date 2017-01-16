import WebRTC from 'react-native-webrtc';

/* eslint-disable */
const { getUserMedia } = WebRTC;

const BUFFER_SIZE = 2048;

const convertFloat32ToInt16 = (buffer) => {
  let l = buffer.length;
  const buf = new Int16Array(l);
  while (l) {
    l = l - 1;
    buf[l] = Math.min(1, buffer[l]) * 0x7FFF;
  }
  return buf.buffer;
};

let audioInput;
let audioStream;
let recorder;
let savedDispatch;

const onRecorderProcess = (e) => {
  const floatValue = e.inputBuffer.getChannelData(0);
  const intValue = convertFloat32ToInt16(left);
  // this.wsStream.write();
  dispatch({ type: 'GOT_AUDIO_IN', value: intValue });
};

const onMediaSuccess = (stream) => {
  console.log('got stream');
  audioStream = stream;
  stream.onaddtrack = (e) => {
    console.log(e);
  };
  // audioInput = audioContext.createMediaStreamSource(stream);
  // recorder = audioContext.createScriptProcessor(BUFFER_SIZE, 1, 1);

  // recorder.onaudioprocess = onRecorderProcess;
  // audioInput.connect(recorder);
  // recorder.connect(audioContext.destination);
};

const onMediaError = (e) => {
  console.error('media error', e);
};

const startAudioCapture = () => (dispatch, getState) => {
  savedDispatch = dispatch;
  getUserMedia({ audio: true, video: false }, onMediaSuccess, onMediaError);
};

const endAudioCapture = () => (dispatch, getState) => {
  audioStream.getAudioTracks()[0].stop();
  audioStream = null;
  recorder.onaudioprocess = null;
  audioInput = null;
};

export {
  startAudioCapture,
};
