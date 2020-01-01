export interface Track {
  setVolume(value: number): void;
  setPan(value: number): void;
  getPeak(): number;
}

export default interface AudioAPI {
  trackList: Track[];
  loadTrackList(trackList: {id: string, name: string, fileURL: string}[]): Promise<void>;
  play(): void;
  stop(): void;
}
