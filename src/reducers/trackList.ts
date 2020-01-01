import { InstIcon } from '../common/Enums';

type Track = {
  id: string,
  name: string,
  volume: number,
  pan: number,
  mute: boolean,
  solo: boolean,
  icon: InstIcon,
  takeIdList: string[],
  activeTakeId: string,
}

const initialState = []

export default function trackList(
  state: typeof initialState = initialState,
  action: any
) {
  switch (action.type) {
    case 'CHANGE_VOLUME':
      return state.map((track: Track) => 
        track.id === action.payload.trackId ? { ...track, volume: action.payload.volume } : track
      );
    case 'CHANGE_PAN':
      return state.map((track: Track) => 
        track.id === action.payload.trackId ? { ...track, pan: action.payload.pan } : track
      );
    case 'CHANGE_NAME':
      return state.map((track: Track) => 
        track.id === action.payload.trackId ? { ...track, name: action.payload.name } : track
      );
    case 'CHANGE_ACTIVE_TAKE':
      return state.map((track: Track) => 
        track.id === action.payload.trackId ? { ...track, activeTakeId: action.payload.activeTakeId } : track
      );
    case 'MUTE_ON':
      return state.map((track: Track) => 
        track.id === action.payload.trackId ? { ...track, mute: true } : track
      );
    case 'MUTE_OFF':
      return state.map((track: Track) => 
        track.id === action.payload.trackId ? { ...track, mute: false } : track
      );
    case 'SOLO_ON':
      return state.map((track: Track) => 
        track.id === action.payload.trackId ? { ...track, solo: true } : track
      );
    case 'SOLO_OFF':
      return state.map((track: Track) => 
        track.id === action.payload.trackId ? { ...track, solo: false } : track
      );
    default:
      return state;
  }
}