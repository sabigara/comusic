import IAudioAPI from '../interface';
import { Track } from './Track';

export default class implements IAudioAPI {
  ac: AudioContext;
  trackList: Track[];
  resolution: number;
  sampleRate: number;
  startTime: number;
  offset: number;

  constructor() {
    this.ac = new AudioContext();
    this.trackList = [];
    this.resolution = 1000;
    this.sampleRate = this.ac.sampleRate;
    this.startTime = 0;
    this.offset = 0;
  }

  public get secondsElapsed() {
    return this.ac.currentTime - this.startTime + this.offset;
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

  play(offset: number) {
    this.startTime = this.ac.currentTime;
    this.offset = offset;
    return Promise.all(this.trackList.map(track => track.play(offset)));
  }

  stop() {
    this.trackList.forEach(track => {
      track.stop();
    })
  }
}