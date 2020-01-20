export interface ITrack {
  readonly duration: number;
  readonly isPlaying: boolean;
  loadFile(url: string): Promise<void>;
  play(offset: number): Promise<void>;
  setVolume(value: number): void;
  setPan(value: number): void;
  // Dynamically get real-time peak.
  readonly peak: number | null;
  // Statically get every peaks of whole audio buffer.
  getPeakList(): { length: number, data: number[][], bits: number } | null;
  mute(): void;
  unMute(): void;
  release(): void;
}

export default interface IAudioAPI {
  readonly tracks: {[key: string]: ITrack};
  readonly sampleRate: number;
  readonly resolution: number;
  readonly secondsElapsed: number;
  readonly masterPeak: number;
  loadTrack(id: string, name: string): ITrack;
  getTrack(id: string): ITrack | null;
  // Return Promise that indicates all tracks has ended.
  play(offset: number): Promise<void[]>;
  stop(): void;
  setMasterVolume(value: number): void;
}
