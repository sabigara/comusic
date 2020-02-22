/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { fireEvent } from '@testing-library/react';

import Color from '../../common/Color';
import * as utils from '../../testutils';
import * as useAudioAPI from '../../hooks/useAudioAPI';
import { PlaybackStatus } from '../../common/Domain';
import PlaybackControls from '../PlaybackControls';

jest.mock('../../BackendAPI/Default');
jest.mock('../../AudioAPI/WebAudioAPI');

const mockState = {
  playback: {
    status: PlaybackStatus.Stopping,
    time: 0,
  },
};

function renderWithRedux(state: any = mockState) {
  const store = utils.initStore(state);
  return { ...utils.renderWithRedux(<PlaybackControls />, store), store };
}

describe('PlaybackControls', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('switches buttons properly', () => {
    const mockAudioAPI = {
      play: jest.fn(),
      stop: jest.fn(),
    };
    jest.spyOn(useAudioAPI, 'default').mockReturnValue(mockAudioAPI as any);
    const { container } = renderWithRedux();
    const playBtn = container.querySelector('#play-button')!;
    const stopBtn = container.querySelector('#stop-button')!;
    const pauseBtn = container.querySelector('#pause-button')!;

    // Initially stopping
    expect(playBtn).toHaveStyle(
      `background-color: ${Color.ToolBarItem.InActive}`,
    );
    expect(stopBtn).toHaveStyle(
      `background-color: ${Color.ToolBarItem.Active}`,
    );
    expect(pauseBtn).toHaveStyle(
      `background-color: ${Color.ToolBarItem.InActive}`,
    );
    expect(mockAudioAPI.stop.mock.calls.length).toBe(1);

    // Play
    fireEvent.click(playBtn);
    expect(playBtn).toHaveStyle(
      `background-color: ${Color.ToolBarItem.Active}`,
    );
    expect(stopBtn).toHaveStyle(
      `background-color: ${Color.ToolBarItem.InActive}`,
    );
    expect(pauseBtn).toHaveStyle(
      `background-color: ${Color.ToolBarItem.InActive}`,
    );
    expect(mockAudioAPI.play.mock.calls.length).toBe(1);

    // Stop
    fireEvent.click(stopBtn);
    expect(playBtn).toHaveStyle(
      `background-color: ${Color.ToolBarItem.InActive}`,
    );
    expect(stopBtn).toHaveStyle(
      `background-color: ${Color.ToolBarItem.Active}`,
    );
    expect(pauseBtn).toHaveStyle(
      `background-color: ${Color.ToolBarItem.InActive}`,
    );
    expect(mockAudioAPI.stop.mock.calls.length).toBe(2);

    // Pause
    fireEvent.click(pauseBtn);
    expect(playBtn).toHaveStyle(
      `background-color: ${Color.ToolBarItem.InActive}`,
    );
    expect(stopBtn).toHaveStyle(
      `background-color: ${Color.ToolBarItem.InActive}`,
    );
    expect(pauseBtn).toHaveStyle(
      `background-color: ${Color.ToolBarItem.Active}`,
    );
    expect(mockAudioAPI.stop.mock.calls.length).toBe(3);
  });

  it('plays and update time', async () => {
    const mockAudioAPI = {
      play: jest.fn(),
      stop: jest.fn(),
      secondsElapsed: 20,
    };
    jest.spyOn(useAudioAPI, 'default').mockReturnValue(mockAudioAPI as any);
    const { container, store } = renderWithRedux();
    const playBtn = container.querySelector('#play-button')!;
    const stopBtn = container.querySelector('#stop-button')!;

    expect(store.getState().playback.time).toBe(0);

    // Play to change status and time elapses.
    fireEvent.click(playBtn);
    await utils.sleep(100); // FIXME: Should be other approach.
    expect(store.getState().playback.status).toBe(PlaybackStatus.Playing);
    expect(store.getState().playback.time).toBe(20);

    // Stop to reset status and time.
    fireEvent.click(stopBtn);
    expect(store.getState().playback.status).toBe(PlaybackStatus.Stopping);
    expect(store.getState().playback.time).toBe(0);
  });
});
