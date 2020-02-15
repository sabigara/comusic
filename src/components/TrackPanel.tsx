import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import {
  muteOn,
  muteOff,
  soloOn,
  soloOff,
  changeVolume,
  changePan,
  changeName,
} from '../actions/tracks';
import { RootState } from '../reducers';
import useAudioAPI from '../hooks/useAudioAPI';
import useShouldTrackPlay from '../hooks/useShouldTrackPlay';
import Color from '../common/Color';
import FlexBox from '../atoms/FlexBox';
import Fader from '../atoms/Fader';
import MuteSoloButton from '../atoms/MutoSoloButton';
import EditableLabel from '../atoms/EditableLabel';
import TrackCtxMenu from './TrackCtxMenu';

type Props = {
  trackId: string;
};

const TrackPanel: React.FC<Props> = ({ trackId }) => {
  const track = useSelector((state: RootState) => {
    return state.tracks.byId[trackId];
  });

  const dispatch = useDispatch();
  const audioAPI = useAudioAPI();
  const [wavePeak, setWavePeak] = React.useState(0);
  const shouldPlay = useShouldTrackPlay(track.id);

  useEffect(() => {
    audioAPI.getTrack(track.id)?.setPan(track.pan);
  }, [audioAPI, track.id, track.pan]);

  useEffect(() => {
    audioAPI.getTrack(track.id)?.setVolume(track.volume);
  }, [audioAPI, track.id, track.volume]);

  useEffect(() => {
    const trackAPI = audioAPI.tracks[track.id];
    if (!trackAPI) return;
    shouldPlay ? trackAPI.unMute() : trackAPI.mute();
  }, [audioAPI, shouldPlay, track.id]);

  useEffect(() => {
    const interval = setInterval(() => {
      const peak = audioAPI.getTrack(track.id)?.peak;
      setWavePeak(peak ? peak * 0.5 : 0);
    }, 50);
    return (): void => clearInterval(interval);
  }, [audioAPI, track.id]);

  return (
    <TrackCtxMenu trackId={trackId}>
      <LeftSide>
        <EditableLabel
          text={track.name}
          setText={(text: string) => dispatch(changeName(track.id, text))}
          fontSize="15px"
        />
        <InstrumentIcon src="placeholder.png" />
      </LeftSide>
      <RightSide>
        <Fader
          onChange={(_: unknown, vol: number) => {
            dispatch(changeVolume(track.id, vol));
          }}
          orientation="horizontal"
          max={1}
          min={0}
          step={0.01}
          value={track.volume}
          wavePeak={wavePeak}
          type="volume"
          railHeight={12}
          knobHeight={23}
          knobWidth={23}
        />
        <FlexBox>
          <PanWrapper>
            <Fader
              onChange={(e, pan) => {
                dispatch(changePan(track.id, pan));
              }}
              orientation="horizontal"
              max={1}
              min={-1}
              step={0.01}
              value={track.pan}
              type="pan"
              railHeight={9}
              knobHeight={15}
              knobWidth={15}
            />
          </PanWrapper>
          <MuteSoloWrapper>
            <MuteSoloButton
              muteOn={track.isMuted}
              onMuteClick={() => {
                track.isMuted
                  ? dispatch(muteOff(track.id))
                  : dispatch(muteOn(track.id));
              }}
              soloOn={track.isSoloed}
              onSoloClick={() => {
                track.isSoloed
                  ? dispatch(soloOff(track.id))
                  : dispatch(soloOn(track.id));
              }}
            />
          </MuteSoloWrapper>
        </FlexBox>
      </RightSide>
    </TrackCtxMenu>
  );
};

const LeftSide = styled.div`
  width: 160px;
  padding: 7px;
  background-color: ${Color.Track.Background};
  text-align: center;
`;

const InstrumentIcon = styled.img`
  width: 70px;
  height: 70px;
  margin-top: 10px;
`;

const RightSide = styled.div`
  width: 180px;
`;

const PanWrapper = styled.div`
  flex-grow: 1;
`;

const MuteSoloWrapper = styled.div`
  margin-right: 10px;
`;

export default TrackPanel;
