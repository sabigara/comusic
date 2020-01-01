export const STATE_UNINITIALIZED = 0;
export const STATE_LOADING = 1;
export const STATE_DECODING = 2;
export const STATE_FINISHED = 3;


export default class {
  constructor(src, audioContext) {
    this.src = src;
    this.ac = audioContext;
  }

  fileLoad(e) {
    const audioData = e.target.response || e.target.result;

    return new Promise((resolve, reject) => {
      this.ac.decodeAudioData(
        audioData,
        (audioBuffer) => {
          this.audioBuffer = audioBuffer;
          resolve(audioBuffer);
        },
        (err) => {
          reject(err);
        },
      );
    });
  }

}
