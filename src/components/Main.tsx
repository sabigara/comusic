import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import KeyBindings from './KeyBindings';
import ToolBar from './ToolBar';
import Browser from './Browser';
import Editor from './Editor';
import useBackendAPI from '../hooks/useBackendAPI';

const Main: React.FC = () => {
  const [openingVer, setOpeningVer] = useState<string>('');
  const [isAuthed, setAuthed] = useState(false);
  const backendAPI = useBackendAPI();
  useEffect(() => {
    const _ = async () => {
      // Try to fetch current user's profile to verify token.
      try {
        await backendAPI.fetchProfile();
      } catch {
        return;
      }
      setAuthed(true);
    };
    _();
  }, []);

  return isAuthed ? (
    <div>
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
