export const changeVolume = (trackId: string, volume: number) => {
  return {
    type: 'CHANGE_VOLUME',
    payload: {
      trackId: trackId,
      volume: volume,
    }
  };
};

export const changePan = (trackId: string, pan: number) => {
  return {
    type: 'CHANGE_PAN',
    payload: {
      trackId: trackId,
      pan: pan,
    }
  };
};

export const changeName = (trackId: string, name: string) => {
  return {
    type: 'CHANGE_NAME',
    payload: {
      trackId: trackId,
      name: name,
    }
  };
};

export const changeActiveTake = (trackId: string, activeTakeId: string) => {
  return {
    type: 'CHANGE_ACTIVE_TAKE',
    payload: {
      trackId: trackId,
      activeTakeId: activeTakeId,
    }
  };
};

export const muteOn = (trackId: string) => {
  return {
    type: 'MUTE_ON',
    payload: {
      trackId: trackId,
    }
  };
};

export const muteOff = (trackId: string) => {
  return {
    type: 'MUTE_OFF',
    payload: {
      trackId: trackId,
    }
  };
};

export const soloOn = (trackId: string) => {
  return {
    type: 'SOLO_ON',
    payload: {
      trackId: trackId,
    }
  };
};

export const soloOff = (trackId: string) => {
  return {
    type: 'SOLO_OFF',
    payload: {
      trackId: trackId,
    }
  };
};

export type Actions = ReturnType<
      typeof changeVolume 
    | typeof changePan
    >;
