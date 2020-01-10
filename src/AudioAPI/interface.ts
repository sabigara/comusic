export interface ITrack {
  readonly duration: number;
  loadFile(url: string): Promise<void>;
  setVolume(value: number): void;
  setPan(value: number): void;
  // Dynamically get real-time peak.
  readonly peak: number | null;
  // Statically get every peaks of whole audio buffer.
  getPeakList(): { length: any; data: any[]; bits: any; };
  mute(): void;
  unMute(): void;
}

export default interface IAudioAPI {
  readonly trackList: ITrack[];
  readonly sampleRate: number;
  readonly resolution: number;
  readonly secondsElapsed: number;
  loadTrack(track: {id: string, name: string, fileURL?: string}): Promise<void>;
  getTrack(id: string): ITrack | null;
  // Return Promise that indicates all tracks has ended.
  play(offset: number): Promise<void[]>;
  stop(): void;
}
