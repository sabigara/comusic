import IAudioAPI from '../interface';
import { Track } from './Track';

export default class implements IAudioAPI {
  ac: AudioContext;
  trackList: Track[];

  constructor() {
    this.ac = new AudioContext();
    this.trackList = [];
  }

  async loadTrack(track: {id: string, name: string, fileURL?: string}) {
    let _track: Track;
    if (this.hasTrack(track.id)) {
      _track = this.getTrack(track.id)!
    } else {
      _track = new Track(track.id, track.name, this.ac);
    }
    track.fileURL && await _track.loadFile(track.fileURL);
    this.trackList.push(_track);
  }

  hasTrack(id: string) {
    return this.trackList.map(_track => _track.id).includes(id);
  }

  getTrack(id: string): Track | null {
    const track = this.trackList.filter(track => track.id === id)[0];
    return track || null;
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