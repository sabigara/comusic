import IAudioAPI from '../interface';
import { Track } from './Track';

export default class implements IAudioAPI {
  ac: AudioContext;
  trackList: Track[];
  startTime: number;

  constructor() {
    this.ac = new AudioContext();
    this.trackList = [];
    this.startTime = 0;
  }

  getSampleRate() {
    return this.ac.sampleRate;
  }

  getSecondsElapsed() {
    return this.ac.currentTime - this.startTime;
  }

  async loadTrack(track: {id: string, name: string, fileURL?: string}) {
    let _track: Track;
    if (this.hasTrack(track.id)) {
      _track = this.getTrack(track.id)!
    } else {
      _track = new Track(track.id, track.name, this.ac);
      this.trackList.push(_track);
    }
    track.fileURL && await _track.loadFile(track.fileURL);
  }

  hasTrack(id: string) {
    return this.trackList.map(_track => _track.id).includes(id);
  }

  getTrack(id: string): Track | null {
    const track = this.trackList.filter(track => track.id === id)[0];
    return track || null;
  }

  play() {
    this.startTime = this.ac.currentTime;
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