import { Track, Take, File } from '../common/Domain';

export type FetchVerContentsResp = {
  tracks: {
    byId: { [id: string]: Track };
    allIds: string[];
  };
  takes: {
    byId: { [id: string]: Take };
    allIds: string[];
  };
  files: {
    byId: { [id: string]: File };
    allIds: string[];
  };
};

export type AddTakeResp = {
  take: Take;
  file: File;
};

export default interface BackendAPI {
  fetchVerContents(verId: string): Promise<FetchVerContentsResp>;
  addTrack(verId: string): Promise<Track>;
  delTrack(trackId: string): Promise<void>;
  addTake(trackId: string, formData: FormData): Promise<AddTakeResp>;
  delTake(takeId: string): Promise<void>;
}
