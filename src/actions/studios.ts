import { Song, Version } from '../common/Domain';

const FETCH_STUDIO_CONTENTS_REQUEST = 'FETCH_STUDIO_CONTENTS_REQUEST' as const;
const FETCH_STUDIO_CONTENTS_SUCCESS = 'FETCH_STUDIO_CONTENTS_SUCCESS' as const;
const FETCH_STUDIO_CONTENTS_FAILURE = 'FETCH_STUDIO_CONTENTS_FAILURE' as const;

export const StudioActionTypeName = {
  FETCH_STUDIO_CONTENTS_REQUEST,
  FETCH_STUDIO_CONTENTS_SUCCESS,
  FETCH_STUDIO_CONTENTS_FAILURE,
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

export type StudioActionUnionType = ReturnType<
  typeof fetchStudioContentsSuccess
>;
