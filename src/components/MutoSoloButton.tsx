import React from 'react';
import styled from 'styled-components';

import Color from '../common/Color';
import Char from './Char'

type Props = {
  muteOn: boolean,
  setMute: Function,
  soloOn: boolean,
  setSolo: Function,
}

export default ({ muteOn, setMute, soloOn, setSolo }: Props) => {
  return (
      <Outer>
        <Mute
          isEnabled={muteOn}
          onClick={() => setMute(!muteOn)}
        >
          <Char text="M"/>
        </Mute>
        <Separator/>
        <Solo
          isEnabled={soloOn}
          onClick={() => setSolo(!soloOn)}
        >
          <Char text="S"/>
        </Solo>
      </Outer>
  )
}

const Outer = styled.div`
  width: 51px;
  height: 25px;
  border-radius: 4px;
  background-color: ${Color.Button.Disabled};
  border: solid 1px ${Color.Border};
  display: flex;
`

const Button = styled.div<{isEnabled: boolean}>`
  width: 25px;
  height: 25px;
  text-align: center;
  line-height: 25px;
`

const Mute = styled(Button)`
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
  background-color: ${props => props.isEnabled ? Color.Button.MuteOn : Color.Button.Disabled};
`

const Solo = styled(Button)`
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
  background-color: ${props => props.isEnabled ? Color.Button.SoloOn : Color.Button.Disabled};
`

const Separator = styled.div`
  width: 1px;
  height: 25px;
  background-color: ${Color.Border};
`