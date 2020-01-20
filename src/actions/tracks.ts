export const changeVolume = (trackId: string, volume: number) => {
  return {
    type: 'CHANGE_VOLUME',
    id: trackId,
    payload: {
      volume: volume,
    }
  };
};

export const changePan = (trackId: string, pan: number) => {
  return {
    type: 'CHANGE_PAN',
    id: trackId,
    payload: {
      pan: pan,
    }
  };
};

export const changeName = (trackId: string, name: string) => {
  return {
    type: 'CHANGE_NAME',
    id: trackId,
    payload: {
      name: name,
    }
  };
};

export const loadTrackRequest = (trackId: string) => {
  return {
    type: 'LOAD_TRACK_REQUEST',
    id: trackId,
  };
};

export const loadTrackSuccess = (trackId: string) => {
  return {
    type: 'LOAD_TRACK_SUCCESS',
    id: trackId,
  };
};

export const changeActiveTake = (trackId: string, activeTakeId: string) => {
  return {
    type: 'CHANGE_ACTIVE_TAKE',
    id: trackId,
    payload: {
      activeTakeId: activeTakeId,
    }
  };
};

export const loadActiveTakeRequest = (trackId: string) => {
  return {
    type: 'LOAD_ACTIVE_TAKE_REQUEST',
    id: trackId,
  };
};

export const loadActiveTakeSuccess = (trackId: string) => {
  return {
    type: 'LOAD_ACTIVE_TAKE_SUCCESS',
    id: trackId,
  };
};

export const muteOn = (trackId: string) => {
  return {
    type: 'MUTE_ON',
    id: trackId,
  };
};

export const muteOff = (trackId: string) => {
  return {
    type: 'MUTE_OFF',
    id: trackId,
  };
};

export const soloOn = (trackId: string) => {
  return {
    type: 'SOLO_ON',
    id: trackId,
  };
};

export const soloOff = (trackId: string) => {
  return {
    type: 'SOLO_OFF',
    id: trackId,
  };
};

export type Actions = ReturnType<
      typeof changeVolume 
    | typeof changePan
    >;
