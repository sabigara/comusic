import HttpLoader from './HttpLoader';

export default class {
  static createLoader(src, audioContext) {
    return new HttpLoader(src, audioContext);
  }
}
