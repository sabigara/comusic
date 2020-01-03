export const STATE_UNINITIALIZED = 0;
export const STATE_LOADING = 1;
export const STATE_DECODING = 2;
export const STATE_FINISHED = 3;


export default class {
  constructor(src, audioContext) {
    this.src = src;
    this.ac = audioContext;
  }

  async fileLoad(arrayBuffer) {
    return await this.ac.decodeAudioData(arrayBuffer);
  }

}
