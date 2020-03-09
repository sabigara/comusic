import { Song } from '../common/Domain';

const ADD_SONG_REQUEST = 'ADD_SONG_REQUEST' as const;
const ADD_SONG_SUCCESS = 'ADD_SONG_SUCCESS' as const;
const ADD_SONG_FAILURE = 'ADD_SONG_FAILURE' as const;

export const SongActionTypeName = {
  ADD_SONG_REQUEST,
  ADD_SONG_SUCCESS,
  ADD_SONG_FAILURE,
};

export const addSongSuccess = (reqId: string, song: Song) => {
  return {
    type: ADD_SONG_SUCCESS,
    id: reqId,
    payload: {
      song: song,
    },
  };
};

export type SongActionUnionType = ReturnType<typeof addSongSuccess>;
