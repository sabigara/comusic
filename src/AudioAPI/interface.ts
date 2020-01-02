export interface ITrack {
  setVolume(value: number): void;
  setPan(value: number): void;
  getPeak(): number;
  mute(): void;
  unMute(): void;
}

export default interface IAudioAPI {
  trackList: ITrack[];
  loadTrackList(trackList: {id: string, name: string, fileURL: string}[]): Promise<void>;
  getTrack(id: string): ITrack | null;
  play(): void;
  stop(): void;
}
