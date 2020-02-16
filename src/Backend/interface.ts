import { TrackState, TrackByIdState } from '../reducers/tracks';
import { TakeState, TakeByIdState } from '../reducers/takes';
import { FileState, FileByIdState } from '../reducers/files';

export type FetchVerContentsResp = {
  tracks: {
    byId: TrackByIdState;
    allIds: string[];
  };
  takes: {
    byId: TakeByIdState;
    allIds: string[];
  };
  files: {
    byId: FileByIdState;
    allIds: string[];
  };
};

export type AddTakeResp = {
  take: TakeState;
  file: FileState;
};

export default interface Backend {
  fetchVerContents(verId: string): Promise<FetchVerContentsResp>;
  addTrack(verId: string): Promise<TrackState>;
  delTrack(trackId: string): Promise<void>;
  addTake(trackId: string, formData: FormData): Promise<AddTakeResp>;
  delTake(takeId: string): Promise<void>;
}
