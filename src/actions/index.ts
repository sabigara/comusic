import { BackendAPI } from '../BackendAPI';
import { FileActionTypeName, FileActionUnionType } from './files';
import { TakeActionTypeName, TakeActionUnionType } from './takes';
import { TrackActionTypeName, TrackActionUnionType } from './tracks';
import { VersionActionTypeName, VersionActionUnionType } from './versions';
import { PlaybackActionTypeName, PlaybackActionUnionType } from './playback';

export const backendAPI = new BackendAPI();

export const ActionTypeName = {
  File: FileActionTypeName,
  Take: TakeActionTypeName,
  Track: TrackActionTypeName,
  Version: VersionActionTypeName,
  Playback: PlaybackActionTypeName,
};

export type ActionUnionType =
  | FileActionUnionType
  | TakeActionUnionType
  | TrackActionUnionType
  | VersionActionUnionType
  | PlaybackActionUnionType;

export const createAction = (type: string, id: string, err?: string) => {
  return {
    type: type,
    id: id,
    err: err,
  };
};
