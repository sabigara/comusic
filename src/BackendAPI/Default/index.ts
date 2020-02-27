/* eslint-disable @typescript-eslint/camelcase */
import { Track } from '../../common/Domain';

import BackendAPI, {
  FetchStudioContentsResp,
  FetchVerContentsResp,
  AddTakeResp,
} from '../interface';
import Http from '../http';

const http = new Http('http', 'localhost', 1323);

export default class Default implements BackendAPI {
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
