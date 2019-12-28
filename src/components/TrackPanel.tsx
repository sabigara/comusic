import React from 'react';
import styled from 'styled-components';

import Color from '../common/Color';
import FlexBox from './FlexBox';
import Fader from './Fader';
import MuteSoloButton from './MutoSoloButton';
import EditableLabel from './EditableLabel';

export default () => {
  const [ label, setLabel ] = React.useState('Drums');
  const [ vol, setVol ] = React.useState(70);
  const [ pan, setPan ] = React.useState(50);

  const [ wavePeak, setWavePeak ] = React.useState(0);
  const [ muteOn, setMute ] = React.useState(false);
  const [ soloOn, setSolo ] = React.useState(false);

  return (
    <Wrapper>
      <LeftSide>
        <EditableLabel
          text={label}
          setText={setLabel}
          fontSize="15px"
        />
        <InstrumentIcon
          src="https://cdn5.vectorstock.com/i/thumb-large/58/94/drum-kit-glyph-icon-music-and-instrument-vector-18445894.jpg"
        />
      </LeftSide>
      <RightSide>
      <Fader
        onChange={(e, vol) => {
          setVol(vol);
        }}
        onChangeCommitted={(e, val) => console.log()}
        onMouseDown={() => console.log()}
        orientation="horizontal"

        max={100}
        min={0}
        step={0.01}
        value={vol}
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
              setPan(pan);
            }}
            onChangeCommitted={(e, val) => console.log()}
            onMouseDown={() => console.log()}
            orientation="horizontal"

            max={100}
            min={0}
            step={0.01}
            value={pan}

            type='pan'
            railHeight={9}
            knobHeight={15}
            knobWidth={15}
          />
        </PanWrapper>
        <MuteSoloWrapper>
          <MuteSoloButton 
            muteOn={muteOn}
            setMute={setMute}
            soloOn={soloOn}
            setSolo={setSolo}
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
