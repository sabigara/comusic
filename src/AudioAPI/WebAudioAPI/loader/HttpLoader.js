import Loader from './Loader';

export default class extends Loader {

  /**
   * Loads an audio file via XHR.
   */
  async load() {
    const resp = await fetch(this.src);
    const arrayBuffer = await resp.arrayBuffer();
    return super.fileLoad(arrayBuffer);
  }
}
