import IAudioAPI from '../interface';
import { Track } from './Track';

type TrackMap = {
  [key: string]: Track;
};

export default class implements IAudioAPI {
  public readonly tracks: TrackMap;
  public readonly sampleRate: number;
  public readonly resolution: number;
  public startTime: number;
  private ac: AudioContext;
  private masterGain: GainNode;
  private masterAnalyzer: AnalyserNode;
  private masterTmpArray: Uint8Array;
  private offset: number;

  constructor() {
    this.ac = new AudioContext();
    this.masterGain = this.ac.createGain();
    this.masterAnalyzer = this.ac.createAnalyser();
    this.masterTmpArray = new Uint8Array(
      this.masterAnalyzer!.frequencyBinCount,
    );
    this.tracks = {};
    this.resolution = 1000;
    this.sampleRate = this.ac.sampleRate;
    this.startTime = 0;
    this.offset = 0;
  }

  public get secondsElapsed() {
    return this.ac.currentTime - this.startTime + this.offset;
  }

  loadTrack(id: string, name: string) {
    const track = new Track(
      id,
      name,
      this.ac,
      this.masterGain,
      this.masterAnalyzer,
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

  play(offset: number) {
    this.startTime = this.ac.currentTime;
    this.offset = offset;
    return Promise.all(
      Object.values(this.tracks).map((track) => track.play(offset)),
    );
  }

  stop() {
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
}
