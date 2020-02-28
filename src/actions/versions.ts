import { Version, Track, Take, File } from '../common/Domain';

const FETCH_VER_CONTENTS_REQUEST = 'FETCH_VER_CONTENTS_REQUEST' as const;
const FETCH_VER_CONTENTS_SUCCESS = 'FETCH_VER_CONTENTS_SUCCESS' as const;
const FETCH_VER_CONTENTS_FAILURE = 'FETCH_VER_CONTENTS_FAILURE' as const;
const ADD_VERSION_REQUEST = 'ADD_VERSION_REQUEST' as const;
const ADD_VERSION_SUCCESS = 'ADD_VERSION_SUCCESS' as const;
const ADD_VERSION_FAILURE = 'ADD_VERSION_FAILURE' as const;
const DEL_VERSION_REQUEST = 'DEL_VERSION_REQUEST' as const;
const DEL_VERSION_SUCCESS = 'DEL_VERSION_SUCCESS' as const;
const DEL_VERSION_FAILURE = 'DEL_VERSION_FAILURE' as const;

export const VersionActionTypeName = {
  FETCH_VER_CONTENTS_REQUEST,
  FETCH_VER_CONTENTS_SUCCESS,
  FETCH_VER_CONTENTS_FAILURE,
  ADD_VERSION_REQUEST,
  ADD_VERSION_SUCCESS,
  ADD_VERSION_FAILURE,
  DEL_VERSION_REQUEST,
  DEL_VERSION_SUCCESS,
  DEL_VERSION_FAILURE,
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

export const addVersion = (songId: string, version: Version) => {
  return {
    type: ADD_VERSION_SUCCESS,
    id: songId,
    payload: {
      version: version,
    },
  };
};

export const delVersion = (verId: string) => {
  return {
    type: DEL_VERSION_SUCCESS,
    id: verId,
  };
};

export type VersionActionUnionType =
  | ReturnType<typeof fetchVerContentsRequest>
  | ReturnType<typeof fetchVerContentsSuccess>
  | ReturnType<typeof fetchVerContentsFailure>
  | ReturnType<typeof addVersion>
  | ReturnType<typeof delVersion>;
