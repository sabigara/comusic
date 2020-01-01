import BlobLoader from './BlobLoader';
import HttpLoader from './HttpLoader';

export default class {
  static createLoader(src, audioContext) {
    if (src instanceof Blob) {
      return new BlobLoader(src, audioContext);
    } else if (typeof (src) === 'string') {
      return new HttpLoader(src, audioContext);
    }
    throw new Error('Unsupported src type');
  }
}
