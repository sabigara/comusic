import { FileActionTypeName, FileActionUnionType } from './files';
import { TakeActionTypeName, TakeActionUnionType } from './takes';
import { TrackActionTypeName, TrackActionUnionType } from './tracks';
import { VersionActionTypeName, VersionActionUnionType } from './versions';
import { StudioActionTypeName, StudioActionUnionType } from './studios';
import { ProfileActionTypeName, ProfileActionUnionType } from './profiles';
import { PlaybackActionTypeName, PlaybackActionUnionType } from './playback';

export const ActionTypeName = {
  File: FileActionTypeName,
  Take: TakeActionTypeName,
  Track: TrackActionTypeName,
  Version: VersionActionTypeName,
  Studio: StudioActionTypeName,
  Profile: ProfileActionTypeName,
  Playback: PlaybackActionTypeName,
};

export type ActionUnionType =
  | FileActionUnionType
  | TakeActionUnionType
  | TrackActionUnionType
  | VersionActionUnionType
  | StudioActionUnionType
  | ProfileActionUnionType
  | PlaybackActionUnionType;

export const createAction = (type: string, id: string, err?: string) => {
  return {
    type: type,
    id: id,
    err: err,
  };
};
