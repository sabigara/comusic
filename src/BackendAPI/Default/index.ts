/* eslint-disable @typescript-eslint/camelcase */
import { Song, Track } from '../../common/Domain';

import BackendAPI, {
  FetchStudiosResp,
  FetchStudioContentsResp,
  FetchVerContentsResp,
  AddTakeResp,
  AddVersionResp,
  FetchProfileResp,
} from '../interface';
import Http from '../http';

export default class Default implements BackendAPI {
  private client: Http;

  constructor(secure: boolean, host: string, port: number) {
    this.client = new Http(secure, host, port);
  }

  async notifyNewUser(
    userId: string,
    nickname: string,
    email: string,
  ): Promise<void> {
    return this.client.post(
      {
        path: 'hooks/new-user',
      },
      {
        email: email,
        nickname: nickname,
        userId: userId,
      },
    );
  }

  async fetchProfile(): Promise<FetchProfileResp> {
    return this.client.get({
      path: 'profile',
    });
  }

  public beforeRequest(func: (request: Request) => Request | Promise<Request>) {
    this.client.beforeRequest(func);
  }

  public afterResponse(
    func: (response: Response) => Response | Promise<Response>,
  ) {
    this.client.afterResponse(func);
  }

  async fetchStudios(memberId: string): Promise<FetchStudiosResp> {
    return this.client.get({
      path: 'studios',
      queries: { member_id: memberId },
    });
  }

  async fetchStudioContents(
    studioId: string,
  ): Promise<FetchStudioContentsResp> {
    return this.client.get({
      path: 'studios/:id/contents',
      params: [studioId],
    });
  }

  async fetchVerContents(verId: string): Promise<FetchVerContentsResp> {
    return this.client.get({
      path: 'versions/:id/contents',
      params: [verId],
    });
  }

  async invite(
    groupId: string,
    email: string,
    groupType: 'studio' | 'song',
  ): Promise<void> {
    return this.client.put({
      path: 'invitations',
      queries: { group_id: groupId, email: email, group_type: groupType },
    });
  }

  async addSong(studioId: string, name: string): Promise<Song> {
    return this.client.post(
      {
        path: 'songs',
        queries: { studio_id: studioId },
      },
      { name },
    );
  }

  async delSong(songId: string): Promise<void> {
    return this.client.post({
      path: 'songs/:id',
      params: [songId],
    });
  }

  async addVersion(songId: string, name: string): Promise<AddVersionResp> {
    return this.client.post(
      {
        path: 'versions',
        queries: { song_id: songId },
      },
      { name: name },
    );
  }

  async delVersion(verId: string): Promise<void> {
    return this.client.delete({
      path: 'versions/:id',
      params: [verId],
    });
  }

  async addTrack(verId: string): Promise<Track> {
    return this.client.post(
      {
        path: 'tracks',
        queries: { version_id: verId },
      },
      { name: '' },
    );
  }

  async delTrack(trackId: string): Promise<void> {
    return this.client.delete({
      path: 'tracks/:id',
      params: [trackId],
    });
  }

  async addTake(trackId: string, formData: FormData): Promise<AddTakeResp> {
    return this.client.post(
      { path: 'takes', queries: { track_id: trackId } },
      formData,
    );
  }

  async delTake(takeId: string): Promise<void> {
    return this.client.delete({ path: 'takes/:id', params: [takeId] });
  }
}
