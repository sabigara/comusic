export const STATE_UNINITIALIZED = 0;
export const STATE_LOADING = 1;
export const STATE_DECODING = 2;
export const STATE_FINISHED = 3;

export default class {
  ac: AudioContext;
  src: string;

  constructor(src: string, audioContext: AudioContext) {
    this.ac = audioContext;
    this.src = src;
  }

  fileLoad(arrayBuffer: ArrayBuffer) {
    return this.ac.decodeAudioData(arrayBuffer);
  }
}
