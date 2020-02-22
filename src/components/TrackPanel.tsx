import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { TrackParam } from '../common/Domain';
import { RootState } from '../reducers';
import useAudioAPI from '../hooks/useAudioAPI';
import { useUpdateTrackParam, useSwitchMuteSolo } from '../hooks/tracks';
import useShouldTrackPlay from '../hooks/useShouldTrackPlay';
import Color from '../common/Color';
import FlexBox from '../atoms/FlexBox';
import Fader from '../atoms/Fader';
import MuteSoloButton from '../atoms/MuteSoloButton';
import EditableLabel from '../atoms/EditableLabel';
import TrackCtxMenu from './TrackCtxMenu';

type Props = {
  trackId: string;
};

const TrackPanel: React.FC<Props> = ({ trackId }) => {
  const track = useSelector((state: RootState) => {
    return state.tracks.byId[trackId] || { id: null };
  });
  const [wavePeak, setWavePeak] = useState(0);
  const updateTrackParam = useUpdateTrackParam();
  const audioAPI = useAudioAPI();
  const shouldPlay = useShouldTrackPlay(track.id);
  const [switchMute, switchSolo] = useSwitchMuteSolo(track.id);

  useEffect(() => {
    const trackAPI = audioAPI.getTrack(track.id);
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

  const onVolumeFaderMove = useCallback((_: unknown, vol: number) => {
    updateTrackParam(track.id, TrackParam.volume, vol);
  }, []);

  const onPanFaderMove = useCallback((_: unknown, pan: number) => {
    updateTrackParam(track.id, TrackParam.pan, pan);
  }, []);

  return (
    <TrackCtxMenu trackId={trackId}>
      <LeftSide>
        <EditableLabel
          text={track.name}
          setText={
            (text: string) => console.log(text) // dispatch(updateTrackParam(track.id, TrackParam.name, 0))
          }
          fontSize="15px"
        />
        <InstrumentIcon src="placeholder.png" />
      </LeftSide>
      <RightSide>
        <Fader
          onChange={onVolumeFaderMove}
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
              onChange={onPanFaderMove}
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
              onMuteClick={switchMute}
              soloOn={track.isSoloed}
              onSoloClick={switchSolo}
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
