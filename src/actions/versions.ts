import { Track, Take, File } from '../common/Domain';

const FETCH_VER_CONTENTS_REQUEST = 'FETCH_VER_CONTENTS_REQUEST' as const;
const FETCH_VER_CONTENTS_SUCCESS = 'FETCH_VER_CONTENTS_SUCCESS' as const;
const FETCH_VER_CONTENTS_FAILURE = 'FETCH_VER_CONTENTS_FAILURE' as const;

export const VersionActionTypeName = {
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
  trackById: { [id: string]: Track },
  trackAllIds: string[],
  takeById: { [id: string]: Take },
  takeAllIds: string[],
  fileById: { [id: string]: File },
  fileAllIds: string[],
) => {
  return {
    type: FETCH_VER_CONTENTS_SUCCESS,
    id: versionId,
    payload: {
      tracks: {
        byId: trackById,
        allIds: trackAllIds,
      },
      takes: {
        byId: takeById,
        allIds: takeAllIds,
      },
      files: {
        byId: fileById,
        allIds: fileAllIds,
      },
    },
  };
};

export const fetchVerContentsFailure = (versionId: string, err: string) => {
  return {
    type: FETCH_VER_CONTENTS_FAILURE,
    id: versionId,
    err: err,
  };
};

export type VersionActionUnionType =
  | ReturnType<typeof fetchVerContentsRequest>
  | ReturnType<typeof fetchVerContentsSuccess>
  | ReturnType<typeof fetchVerContentsFailure>;
