/* eslint-disable @typescript-eslint/camelcase */
import { TrackState } from '../../reducers/tracks';

import Backend, { FetchVerContentsResp, AddTakeResp } from '../interface';
import Http from '../http';

const http = new Http('http', 'localhost', 1323);

export default class Default implements Backend {
  async fetchVerContents(verId: string): Promise<FetchVerContentsResp> {
    return http.get({
      path: 'versions/:id/contents',
      params: [verId],
    });
  }

  async addTrack(verId: string): Promise<TrackState> {
    return http.post({
      path: 'tracks',
      queries: { version_id: verId },
    });
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
