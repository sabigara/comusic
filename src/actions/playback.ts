export const play = () => {
  return {
    type: 'PLAY',
  };
};

export const pause = () => {
  return {
    type: 'PAUSE',
  };
};

export const stop = () => {
  return {
    type: 'STOP',
  };
};

export const updateTime = (secondsElapsed: number) => {
  return {
    type: 'UPDATE_TIME',
    payload: {
      secondsElapsed: secondsElapsed,
    }
  };
};


export const changeMasterVolume = (masterVolume: number) => {
  return {
    type: 'CHANGE_MASTER_VOLUME',
    payload: {
      masterVolume: masterVolume,
    }
  };
};

export type Actions = (
  | ReturnType<typeof play>
  | ReturnType<typeof pause>
  | ReturnType<typeof stop>
);
