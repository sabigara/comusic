import AudioAPI from '../interface';
import Track from './Track';
import LoaderFactory from './loader/LoaderFactory';

export default class implements AudioAPI {
  ac: AudioContext;
  trackList: Track[];

  constructor() {
    this.ac = new AudioContext();
    this.trackList = [];
  }

  async loadTrackList(trackList: {id: string, name: string, fileURL: string}[]) {
    const loadPromises = trackList.map((track) => {
      const loader = LoaderFactory.createLoader(track.fileURL, this.ac);
      return loader.load();
    });

    const audioBuffers = await Promise.all(loadPromises);
    audioBuffers.forEach((audioBuffer, i) => {
      const trackParams = trackList[i];
      const track = new Track(trackParams.id, trackParams.name, this.ac, audioBuffer);
      this.trackList.push(track);
    });
  }

  play() {
    this.trackList.forEach(track => {
      track.play();
    })
  }

  stop() {
    this.trackList.forEach(track => {
      track.stop();
    })
  }
}