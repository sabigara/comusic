import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import KeyBindings from './KeyBindings';
import ToolBar from './ToolBar';
import Browser from './Browser';
import Editor from './Editor';
import useBackendAPI from '../hooks/useBackendAPI';
import useCentrifuge from '../hooks/useCentrifuge';

const Main: React.FC = () => {
  const [openingVer, setOpeningVer] = useState<string>('');
  const [isAuthed, setAuthed] = useState(false);
  const backendAPI = useBackendAPI();
  const centrifuge = useCentrifuge();

  useEffect(() => {
    const _ = async () => {
      // Try to fetch current user's profile to verify token.
      try {
        await backendAPI.fetchProfile();
      } catch {
        return;
      }
      let pubsubToken = localStorage.getItem('pubsubToken');
      if (!pubsubToken) {
        try {
          const resp = await backendAPI.getPubSubToken();
          pubsubToken = resp.pubsubToken;
          localStorage.setItem('pubsubToken', resp.pubsubToken);
        } catch (err) {
          throw Error('Cannot acquire pubsubToken');
        }
      }
      centrifuge.setToken(pubsubToken);
      centrifuge.connect();
      setAuthed(true);
    };
    _();
    return () => {
      centrifuge.disconnect();
    };
  }, []);

  return isAuthed ? (
    <div className="bp3-dark">
      <KeyBindings />
      <ToolBar />
      <FixedHeightContainer>
        <Browser setVerId={setOpeningVer} />
        <Editor verId={openingVer} />
      </FixedHeightContainer>
    </div>
  ) : (
    <div>logging in</div>
  );
};

const FixedHeightContainer = styled.div`
  height: calc(100vh - 70px);
  display: flex;
`;

export default Main;
