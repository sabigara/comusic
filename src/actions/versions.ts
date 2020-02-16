import { TrackByIdState } from '../reducers/tracks';
import { TakeByIdState } from '../reducers/takes';
import { FileByIdState } from '../reducers/files';

import { backendAPI } from '.';

const FETCH_VER_CONTENTS_REQUEST = 'FETCH_VER_CONTENTS_REQUEST' as const;
export const FETCH_VER_CONTENTS_SUCCESS = 'FETCH_VER_CONTENTS_SUCCESS' as const;
const FETCH_VER_CONTENTS_FAILURE = 'FETCH_VER_CONTENTS_FAILURE' as const;

export const ActionTypeName = {
  FETCH_VER_CONTENTS_REQUEST,
  FETCH_VER_CONTENTS_SUCCESS,
  FETCH_VER_CONTENTS_FAILURE,
};

export const fetchVerContentsRequest = (versionId: string) => {
  return {
    type: FETCH_VER_CONTENTS_REQUEST,
    id: versionId,
  };
};

export const fetchVerContentsSuccess = (
  versionId: string,
  tracksById: TrackByIdState,
  tracksAllIds: string[],
  takesById: TakeByIdState,
  takesAllIds: string[],
  filesById: FileByIdState,
  filesAllIds: string[],
) => {
  return {
    type: FETCH_VER_CONTENTS_SUCCESS,
    id: versionId,
    payload: {
      tracks: {
        byId: tracksById,
        allIds: tracksAllIds,
      },
      takes: {
        byId: takesById,
        allIds: takesAllIds,
      },
      files: {
        byId: filesById,
        allIds: filesAllIds,
      },
    },
  };
};

export const fetchVerContentsFailure = (versionId: string) => {
  return {
    type: FETCH_VER_CONTENTS_FAILURE,
    id: versionId,
  };
};

export const fetchVerContents = (versionId: string) => {
  return async (dispatch: any) => {
    dispatch(fetchVerContentsRequest(versionId));
    try {
      const resp = await backendAPI.fetchVerContents(versionId);
      dispatch(
        fetchVerContentsSuccess(
          versionId,
          resp.tracks.byId,
          resp.tracks.allIds,
          resp.takes.byId,
          resp.takes.allIds,
          resp.files.byId,
          resp.files.allIds,
        ),
      );
    } catch (err) {
      dispatch(fetchVerContentsFailure(versionId));
    }
  };
};

export type ActionUnionType =
  | ReturnType<typeof fetchVerContentsRequest>
  | ReturnType<typeof fetchVerContentsSuccess>
  | ReturnType<typeof fetchVerContentsFailure>;
