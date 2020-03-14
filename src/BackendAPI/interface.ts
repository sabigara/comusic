import {
  Profile,
  Studio,
  Song,
  Version,
  Track,
  Take,
  File,
  GroupType,
} from '../common/Domain';

type Resource<T> = {
  byId: {
    [id: string]: T;
  };
  allIds: string[];
};

export type FetchProfileResp = Profile;

export type FetchStudiosResp = {
  studios: Resource<Studio>;
};

export type FetchStudioContentsResp = {
  songs: Resource<Song>;
  versions: Resource<Version>;
};

export type FetchStudioMembersResp = {
  members: Resource<Profile>;
};

export type FetchVerContentsResp = {
  tracks: Resource<Track>;
  takes: Resource<Take>;
  files: Resource<File>;
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
  getPubSubToken(): Promise<{ pubsubToken: string }>;
  fetchProfile(): Promise<FetchProfileResp>;
  fetchStudios(memberId: string): Promise<FetchStudiosResp>;
  fetchStudioContents(studioId: string): Promise<FetchStudioContentsResp>;
  fetchStudioMembers(studioId: string): Promise<FetchStudioMembersResp>;
  fetchVerContents(verId: string): Promise<FetchVerContentsResp>;
  invite(groupId: string, email: string, groupType: GroupType): Promise<void>;
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
