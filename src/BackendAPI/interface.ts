import { Song, Version, Track, Take, File } from '../common/Domain';

export type FetchStudioContentsResp = {
  songs: {
    byId: { [id: string]: Song };
    allIds: string[];
  };
  versions: {
    byId: { [id: string]: Version };
    allIds: string[];
  };
};

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
  fetchStudioContents(studioId: string): Promise<FetchStudioContentsResp>;
  fetchVerContents(verId: string): Promise<FetchVerContentsResp>;
  addTrack(verId: string): Promise<Track>;
  delTrack(trackId: string): Promise<void>;
  addTake(trackId: string, formData: FormData): Promise<AddTakeResp>;
  delTake(takeId: string): Promise<void>;
}
