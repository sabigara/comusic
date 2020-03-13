import {
  Profile,
  Studio,
  Song,
  Version,
  Track,
  Take,
  File,
} from '../common/Domain';

export type FetchProfileResp = Profile;

export type FetchStudiosResp = {
  studios: {
    byId: { [id: string]: Studio };
    allIds: string[];
  };
};

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

export type AddVersionResp = Version;

export default interface BackendAPI {
  beforeRequest(func: (request: Request) => Request | Promise<Request>): void;
  afterResponse(
    func: (response: Response) => Response | Promise<Response>,
  ): void;
  notifyNewUser(userId: string, nickname: string, mail: string): Promise<void>;
  fetchProfile(): Promise<FetchProfileResp>;
  fetchStudios(memberId: string): Promise<FetchStudiosResp>;
  fetchStudioContents(studioId: string): Promise<FetchStudioContentsResp>;
  fetchVerContents(verId: string): Promise<FetchVerContentsResp>;
  invite(
    groupId: string,
    email: string,
    groupType: 'studio' | 'song',
  ): Promise<void>;
  fetchInvitations(email: string): Promise<any>;
  acceptInvitation(groupId: string): Promise<void>;
  addSong(studioId: string, name: string): Promise<Song>;
  delSong(songId: string): Promise<void>;
  addVersion(songId: string, verName: string): Promise<Version>;
  delVersion(verId: string): Promise<void>;
  addTrack(verId: string): Promise<Track>;
  delTrack(trackId: string): Promise<void>;
  addTake(trackId: string, formData: FormData): Promise<AddTakeResp>;
  delTake(takeId: string): Promise<void>;
}
