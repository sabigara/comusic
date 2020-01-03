export interface ITrack {
  loadFile(url: string): void;
  setVolume(value: number): void;
  setPan(value: number): void;
  // Dynamically get real-time peak.
  getPeak(): number;
  // Statically get every peaks of whole audio buffer.
  getPeakList(): { length: any; data: any[]; bits: any; };
  mute(): void;
  unMute(): void;
}

export default interface IAudioAPI {
  trackList: ITrack[];
  loadTrack(track: {id: string, name: string, fileURL?: string}): Promise<void>;
  getTrack(id: string): ITrack | null;
  play(): void;
  stop(): void;
}