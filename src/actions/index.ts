import { FileActionTypeName, FileActionUnionType } from './files';
import { TakeActionTypeName, TakeActionUnionType } from './takes';
import { TrackActionTypeName, TrackActionUnionType } from './tracks';
import { VersionActionTypeName, VersionActionUnionType } from './versions';
import { SongActionTypeName, SongActionUnionType } from './songs';
import { StudioActionTypeName, StudioActionUnionType } from './studios';
import {
  InvitationActionTypeName,
  InvitationActionUnionType,
} from './invitations';
import { ProfileActionTypeName, ProfileActionUnionType } from './profiles';
import { PlaybackActionTypeName, PlaybackActionUnionType } from './playback';

export const ActionTypeName = {
  File: FileActionTypeName,
  Take: TakeActionTypeName,
  Track: TrackActionTypeName,
  Version: VersionActionTypeName,
  Song: SongActionTypeName,
  Studio: StudioActionTypeName,
  Invitation: InvitationActionTypeName,
  Profile: ProfileActionTypeName,
  Playback: PlaybackActionTypeName,
};

export type ActionUnionType =
  | FileActionUnionType
  | TakeActionUnionType
  | TrackActionUnionType
  | VersionActionUnionType
  | SongActionUnionType
  | StudioActionUnionType
  | InvitationActionUnionType
  | ProfileActionUnionType
  | PlaybackActionUnionType;

export const createAction = (type: string, id: string, err?: string) => {
  return {
    type: type,
    id: id,
    err: err,
  };
};

export type Resource<T> = {
  byId: {
    [id: string]: T;
  };
  allIds: string[];
};
