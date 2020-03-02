/* eslint-disable @typescript-eslint/camelcase */
import { Track } from '../../common/Domain';

import BackendAPI, {
  FetchStudioContentsResp,
  FetchVerContentsResp,
  AddTakeResp,
  AddVersionResp,
  FetchProfileResp,
} from '../interface';
import Http from '../http';

const http = new Http(false, 'localhost', 1323);

export default class Default implements BackendAPI {
  async fetchProfile(): Promise<FetchProfileResp> {
    return http.get({
      path: 'profile',
    });
  }

  public beforeRequest(func: (request: Request) => Request | Promise<Request>) {
    http.beforeRequest(func);
  }

  public afterResponse(
    func: (response: Response) => Response | Promise<Response>,
  ) {
    http.afterResponse(func);
  }

  async fetchStudioContents(
    studioId: string,
  ): Promise<FetchStudioContentsResp> {
    return http.get({
      path: 'studios/:id/contents',
      params: [studioId],
    });
  }
  async fetchVerContents(verId: string): Promise<FetchVerContentsResp> {
    return http.get({
      path: 'versions/:id/contents',
      params: [verId],
    });
  }

  async addVersion(songId: string, name: string): Promise<AddVersionResp> {
    return http.post(
      {
        path: 'versions',
        queries: { song_id: songId },
      },
      { name: name },
    );
  }

  async delVersion(verId: string): Promise<void> {
    return http.delete({
      path: 'versions/:id',
      params: [verId],
    });
  }

  async addTrack(verId: string): Promise<Track> {
    return http.post(
      {
        path: 'tracks',
        queries: { version_id: verId },
      },
      { name: '' },
    );
  }

  async delTrack(trackId: string): Promise<void> {
    return http.delete({
      path: 'tracks/:id',
      params: [trackId],
    });
  }

  async addTake(trackId: string, formData: FormData): Promise<AddTakeResp> {
    return http.post(
      { path: 'takes', queries: { track_id: trackId } },
      formData,
    );
  }

  async delTake(takeId: string): Promise<void> {
    return http.delete({ path: 'takes/:id', params: [takeId] });
  }
}
