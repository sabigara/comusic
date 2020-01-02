import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import {
  muteOn, muteOff, soloOn, soloOff,
  changeVolume, changePan, changeName,
} from '../actions/trackList';
import useAudioAPI from '../hooks/useAudioAPI';
import useShouldTrackPlay from '../hooks/useShouldTrackPlay';
import Color from '../common/Color';
import FlexBox from '../atoms/FlexBox';
import Fader from '../atoms/Fader';
import MuteSoloButton from '../atoms/MutoSoloButton';
import EditableLabel from '../atoms/EditableLabel';

type Props = {
  trackId: string,
}

const TrackPanel: React.FC<Props> = ({ trackId }) => {
  const state = useSelector((state: any) => {
    const track = state.trackList.filter((track: any) => track.id === trackId);
    return track ? track[0] : null
  });

  const dispatch = useDispatch();
  const audioAPI = useAudioAPI();
  const [ wavePeak, setWavePeak ] = React.useState(0);

  const trackAPI = audioAPI.getTrack(state.id)!;
  const shouldPlay = useShouldTrackPlay(state.id);

  useEffect(() => {
    trackAPI.setPan(state.pan);
  }, [state.pan, trackAPI]);

  useEffect(() => {
    trackAPI.setVolume(state.volume);
  }, [state.volume, trackAPI]);

  useEffect(() => {
    shouldPlay ? trackAPI.unMute() : trackAPI.mute();
  }, [shouldPlay, audioAPI, trackAPI])

  useEffect(() => {
    const interval = setInterval(() => {
      setWavePeak(trackAPI?.getPeak() ? trackAPI?.getPeak() * 0.5 : 0);
    }, 1);
    return () => clearInterval(interval);
  }, [trackAPI]);

  return (
    <Wrapper>
      <LeftSide>
        <EditableLabel
          text={state.name}
          setText={(text: string) => dispatch(changeName(state.id, text))}
          fontSize="15px"
        />
        <InstrumentIcon
          src=""
        />
      </LeftSide>
      <RightSide>
      <Fader
        onChange={(e, vol) => {
          dispatch(changeVolume(state.id, vol));
        }}
        onChangeCommitted={(e, val) => {}}
        onMouseDown={() => {}}
        orientation="horizontal"

        max={1}
        min={0}
        step={0.01}
        value={state.volume}
        wavePeak={wavePeak}
        type='volume'
        railHeight={12}
        knobHeight={23}
        knobWidth={23}
      />
      <FlexBox>
        <PanWrapper>
          <Fader
            onChange={(e, pan) => {
              dispatch(changePan(state.id, pan));
            }}
            onChangeCommitted={(e, val) => {}}
            onMouseDown={() => {}}
            orientation="horizontal"
            max={1}
            min={-1}
            step={0.01}
            value={state.pan}
            type='pan'
            railHeight={9}
            knobHeight={15}
            knobWidth={15}
          />
        </PanWrapper>
        <MuteSoloWrapper>
          <MuteSoloButton 
            muteOn={state.mute}
            onMuteClick={() => {
              state.mute ? dispatch(muteOff(state.id)) : dispatch(muteOn(state.id));
            }}
            soloOn={state.solo}
            onSoloClick={() => {
              state.solo ? dispatch(soloOff(state.id)) : dispatch(soloOn(state.id));
            }}
          />
        </MuteSoloWrapper>
      </FlexBox>
      </RightSide>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  width: 360px;
  height: 170px;
  background-color: ${Color.Background};
`

const LeftSide = styled.div`
  width: 160px;
  height: 150px;
  padding: 7px;
  background-color: ${Color.Background};
  text-align: center;
`

const InstrumentIcon = styled.img`
  width: 70px;
  height: 70px;
  margin-top: 10px;
`

const RightSide = styled.div`
  width: 180px;
  height: 170px;
`

const PanWrapper = styled.div`
  flex-grow: 1;
`

const MuteSoloWrapper = styled.div`
  margin-right: 10px;
`

export default TrackPanel;
