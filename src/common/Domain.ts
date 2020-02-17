export enum PlaybackStatus {
  Playing,
  Pausing,
  Stopping,
}

export enum InstIcon {
  Drums,
  Bass,
  Guitar,
  Vocal,
}

export enum TrackParam {
  volume = 'volume',
  pan = 'pan',
  isMuted = 'isMuted',
  isSoloed = 'isSoloed',
}

type Domain = {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export type Track = {
  versionId: string;
  activeTake: string;
  name: string;
  volume: number;
  pan: number;
  isMuted: boolean;
  isSoloed: boolean;
  icon: InstIcon;
} & Domain;

export type Take = {
  trackId: string;
  fileId: string;
  name: string;
} & Domain;

export type File = {
  url: string;
} & Domain;
