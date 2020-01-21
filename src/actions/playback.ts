const PLAY = 'PLAY' as const;
const PAUSE = 'PAUSE' as const;
const STOP = 'STOP' as const;
const UPDATE_TIME = 'UPDATE_TIME' as const;
const CHANGE_MASTER_VOLUME = 'CHANGE_MASTER_VOLUME' as const;

export const ActionTypeName = {
  PLAY,
  PAUSE,
  STOP,
  UPDATE_TIME,
  CHANGE_MASTER_VOLUME,
};

export const play = () => {
  return {
    type: PLAY,
  };
};

export const pause = () => {
  return {
    type: PAUSE,
  };
};

export const stop = () => {
  return {
    type: STOP,
  };
};

export const updateTime = (secondsElapsed: number) => {
  return {
    type: UPDATE_TIME,
    payload: {
      secondsElapsed: secondsElapsed,
    },
  };
};

export const changeMasterVolume = (masterVolume: number) => {
  return {
    type: CHANGE_MASTER_VOLUME,
    payload: {
      masterVolume: masterVolume,
    },
  };
};

export type ActionUnionType =
  | ReturnType<typeof play>
  | ReturnType<typeof pause>
  | ReturnType<typeof stop>
  | ReturnType<typeof updateTime>
  | ReturnType<typeof changeMasterVolume>;
