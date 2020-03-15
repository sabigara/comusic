import IAudioAPI, { LoadFunc } from '../interface';
import { Track } from './Track';

type TrackMap = {
  [key: string]: Track;
};

export default class implements IAudioAPI {
  public readonly tracks: TrackMap;
  public readonly sampleRate: number;
  public readonly resolution: number;
  private startTime: number | null;
  private offset: number;
  private updatePerSec = 20;
  private updateCallbacks: ((time: number) => void)[] = [];
  private ac: AudioContext;
  private masterGain: GainNode;
  private masterAnalyzer: AnalyserNode;
  private masterTmpArray: Uint8Array;
  private load: LoadFunc;
  private interval?: number;
  private isPlaying: boolean;

  constructor(load: LoadFunc) {
    this.ac = new AudioContext();
    this.masterGain = this.ac.createGain();
    this.masterAnalyzer = this.ac.createAnalyser();
    this.masterTmpArray = new Uint8Array(
      this.masterAnalyzer!.frequencyBinCount,
    );
    this.tracks = {};
    this.resolution = 1000;
    this.sampleRate = this.ac.sampleRate;
    this.offset = 0;
    this.startTime = null;
    this.load = load;
    this.isPlaying = false;

    this.interval = setInterval(() => {
      this.updateCallbacks.forEach((callback) => callback(this.time));
    }, this.updatePerSec);
  }

  set time(n: number) {
    this.offset = n;
  }

  get time() {
    if (this.isPlaying) {
      return this.secondsElapsed;
    } else {
      return this.offset;
    }
  }

  get secondsElapsed() {
    return this.startTime
      ? this.ac.currentTime - this.startTime + this.offset
      : 0 + this.offset;
  }

  onTimeUpdate(callback: (time: number) => void) {
    this.updateCallbacks.push(callback);
  }

  loadTrack(id: string) {
    const track = new Track(
      id,
      this.ac,
      this.masterGain,
      this.masterAnalyzer,
      this.load,
    );
    this.tracks[id] = track;
    return track;
  }

  hasTrack(id: string) {
    return id in this.tracks;
  }

  getTrack(id: string): Track | null {
    return this.tracks[id] || null;
  }

  play() {
    this.startTime = this.ac.currentTime;
    this.isPlaying = true;

    return Promise.all(
      Object.values(this.tracks).map((track) => track.play(this.offset)),
    );
  }

  stop() {
    this.startTime = null;
    this.isPlaying = false;
    Object.values(this.tracks).forEach((track) => {
      track.stop();
    });
  }

  setMasterVolume(value: number) {
    this.masterGain.gain.value = value;
  }

  public get masterPeak(): number {
    this.masterAnalyzer.getByteFrequencyData(this.masterTmpArray);
    return Math.max.apply(null, Array.from(this.masterTmpArray));
  }

  removeListeners() {
    this.updateCallbacks = [];
  }

  release() {
    clearInterval(this.interval);
  }
}
