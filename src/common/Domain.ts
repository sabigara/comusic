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

export type User = {
  id: string;
};

type Domain = {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export type Profile = {
  userId: string;
  nickname: string;
  bio: string;
} & Domain;

export type Studio = {
  ownerId: string;
  name: string;
} & Domain;

export type Song = {
  studioId: string;
  name: string;
} & Domain;

export type Version = {
  songId: string;
  name: string;
} & Domain;

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
