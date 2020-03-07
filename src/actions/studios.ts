import { Studio, Song, Version } from '../common/Domain';

const FETCH_STUDIOS_REQUEST = 'FETCH_STUDIOS_REQUEST' as const;
const FETCH_STUDIOS_SUCCESS = 'FETCH_STUDIOS_SUCCESS' as const;
const FETCH_STUDIOS_FAILURE = 'FETCH_STUDIOS_FAILURE' as const;
const FETCH_STUDIO_CONTENTS_REQUEST = 'FETCH_STUDIO_CONTENTS_REQUEST' as const;
const FETCH_STUDIO_CONTENTS_SUCCESS = 'FETCH_STUDIO_CONTENTS_SUCCESS' as const;
const FETCH_STUDIO_CONTENTS_FAILURE = 'FETCH_STUDIO_CONTENTS_FAILURE' as const;

export const StudioActionTypeName = {
  FETCH_STUDIOS_REQUEST,
  FETCH_STUDIOS_SUCCESS,
  FETCH_STUDIOS_FAILURE,
  FETCH_STUDIO_CONTENTS_REQUEST,
  FETCH_STUDIO_CONTENTS_SUCCESS,
  FETCH_STUDIO_CONTENTS_FAILURE,
};

export const fetchStudiosSuccess = (
  byId: { [id: string]: Studio },
  allIds: string[],
) => {
  return {
    type: FETCH_STUDIOS_SUCCESS,
    id: '',
    payload: {
      byId: byId,
      allIds: allIds,
    },
  };
};

export const fetchStudioContentsSuccess = (
  studioId: string,
  songById: { [id: string]: Song },
  songAllIds: string[],
  verById: { [id: string]: Version },
  verAllIds: string[],
) => {
  return {
    type: FETCH_STUDIO_CONTENTS_SUCCESS,
    id: studioId,
    payload: {
      songs: {
        byId: songById,
        allIds: songAllIds,
      },
      versions: {
        byId: verById,
        allIds: verAllIds,
      },
    },
  };
};

export type StudioActionUnionType =
  | ReturnType<typeof fetchStudiosSuccess>
  | ReturnType<typeof fetchStudioContentsSuccess>;
