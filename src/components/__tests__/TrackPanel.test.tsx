/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { fireEvent } from '@testing-library/react';

import Color from '../../common/Color';
import * as utils from '../../testutils';
import * as TrackHooks from '../../hooks/tracks';
import { ActionTypeName as ATN, createAction } from '../../actions';
import { delTrackSuccess } from '../../actions/tracks';
import TrackPanel from '../TrackPanel';

jest.mock('../../AudioAPI/WebAudioAPI');
jest.mock('../../BackendAPI/Default');

const mockState = {
  tracks: {
    byId: {
      '86017d4b-fb33-46ce-b3db-29a4300448f3': {
        id: '86017d4b-fb33-46ce-b3db-29a4300448f3',
        createdAt: '2020-02-21T05:09:07Z',
        updatedAt: '2020-02-21T05:12:03Z',
        versionId: '6f3291f3-ec12-409d-a3ba-09e813bd96ba',
        name: 'Drums',
        volume: 0.7,
        pan: 0,
        isMuted: false,
        isSoloed: false,
        icon: 0,
        activeTake: '11e44e9d-4ef7-40cc-ba5b-24338bff14e0',
      },
    },
    allIds: ['86017d4b-fb33-46ce-b3db-29a4300448f3'],
  },
  takes: {
    byId: {
      '11e44e9d-4ef7-40cc-ba5b-24338bff14e0': {
        id: '11e44e9d-4ef7-40cc-ba5b-24338bff14e0',
        createdAt: '2020-02-21T05:10:21Z',
        updatedAt: '2020-02-21T05:10:21Z',
        trackId: '86017d4b-fb33-46ce-b3db-29a4300448f3',
        name: 'drs-tk1',
        fileId: 'a0a8bbfe-7cf8-4261-ac22-cf7ebe73b533',
      },
      '54027b56-8047-4180-9d4a-5db5c7c7ed6e': {
        id: '54027b56-8047-4180-9d4a-5db5c7c7ed6e',
        createdAt: '2020-02-21T05:12:03Z',
        updatedAt: '2020-02-21T05:12:03Z',
        trackId: '86017d4b-fb33-46ce-b3db-29a4300448f3',
        name: 'drs-tk2',
        fileId: '59e651ce-7762-47da-bca8-bf4f4b49e2f3',
      },
    },
    allIds: [
      '11e44e9d-4ef7-40cc-ba5b-24338bff14e0',
      '54027b56-8047-4180-9d4a-5db5c7c7ed6e',
    ],
  },
  files: {
    byId: {
      '59e651ce-7762-47da-bca8-bf4f4b49e2f3': {
        url: 'some-url',
      },
      'a0a8bbfe-7cf8-4261-ac22-cf7ebe73b533': {
        url: 'some-url',
      },
    },
    allIds: [
      'a0a8bbfe-7cf8-4261-ac22-cf7ebe73b533',
      '59e651ce-7762-47da-bca8-bf4f4b49e2f3',
    ],
  },
};

function renderWithRedux(store?: any) {
  if (!store) {
    store = utils.initStore(mockState);
  }
  return utils.renderWithRedux(
    <TrackPanel trackId={'86017d4b-fb33-46ce-b3db-29a4300448f3'} />,
    store,
  );
}

describe('TrackPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  // FIXME: react-test-renderer sometimes complains "An update to
  // TrackPanel inside a test was not wrapped in act", but sometimes not.
  // https://reactjs.org/docs/test-utils.html#act
  it('activates mute/solo buttons correctly', () => {
    const { container } = renderWithRedux();
    const muteBtn = container.querySelector('.mute-button')!;
    const soloBtn = container.querySelector('.solo-button')!;
    expect(muteBtn).toHaveStyle(`background-color: ${Color.Button.Disabled}`);
    expect(soloBtn).toHaveStyle(`background-color: ${Color.Button.Disabled}`);
    // Test mute
    fireEvent.click(muteBtn);
    expect(muteBtn).toHaveStyle(`background-color: ${Color.Button.MuteOn}`);
    fireEvent.click(muteBtn);
    // Test solo
    fireEvent.click(soloBtn);
    expect(soloBtn).toHaveStyle(`background-color: ${Color.Button.SoloOn}`);
    fireEvent.click(soloBtn);
    // Test both
    fireEvent.click(muteBtn);
    fireEvent.click(soloBtn);
    expect(muteBtn).toHaveStyle(`background-color: ${Color.Button.MuteOn}`);
    expect(soloBtn).toHaveStyle(`background-color: ${Color.Button.SoloOn}`);
  });

  it('deletes track by ctx menu button', () => {
    const store = utils.initStore(mockState);
    // Replace custom hook that returns async function with
    // one returns synchronous version.
    const mockUseDelTrack = jest.spyOn(TrackHooks, 'useDelTrack');
    const mockDelTrack = jest.fn().mockImplementation((trackId: string) => {
      store.dispatch(createAction(ATN.Track.DEL_TRACK_REQUEST, trackId));
      store.dispatch(
        delTrackSuccess(trackId, [
          '11e44e9d-4ef7-40cc-ba5b-24338bff14e0',
          '54027b56-8047-4180-9d4a-5db5c7c7ed6e',
        ]),
      );
    });
    mockUseDelTrack.mockReturnValue(mockDelTrack);
    const { container, getByText } = renderWithRedux(store);
    fireEvent.contextMenu(container);
    fireEvent.click(getByText('Delete'));
    const state = store.getState();
    // Assert specified track and related takes are all deleted.
    expect(state.tracks.byId).toStrictEqual({});
    expect(state.tracks.allIds).toStrictEqual([]);
    expect(state.takes.byId).toStrictEqual({});
    expect(state.takes.allIds).toStrictEqual([]);
  });
});

describe('Faders', () => {
  // Deep copy global object
  const state = JSON.parse(JSON.stringify(mockState));

  const renderFaders = (vol: number, pan: number) => {
    const track = state.tracks.byId['86017d4b-fb33-46ce-b3db-29a4300448f3'];
    track.volume = vol;
    track.pan = pan;
    const { container } = renderWithRedux(utils.initStore(state));
    const volFader = container.querySelector('.fader-vol')!;
    const panFader = container.querySelector('.fader-pan')!;
    const volKnob = volFader.querySelector('.fader-knob')!;
    const panKnob = panFader.querySelector('.fader-knob')!;
    return [volKnob, panKnob];
  };

  it('render knobs at correct place', () => {
    const [vol, pan] = renderFaders(0.7, 0);
    expect(vol).toHaveStyle('left: 70%');
    expect(pan).toHaveStyle('left: 50%');
  });

  it('render knobs at correct place', () => {
    const [vol, pan] = renderFaders(0, 0.5);
    expect(vol).toHaveStyle('left: 0%');
    expect(pan).toHaveStyle('left: 75%');
  });

  it('render knobs at correct place', () => {
    const [vol, pan] = renderFaders(1, -1);
    expect(vol).toHaveStyle('left: 100%');
    expect(pan).toHaveStyle('left: 0%');
  });

  it('render knobs at left-most, when value is smaller than minimum', () => {
    const [vol, pan] = renderFaders(-100, -100);
    expect(vol).toHaveStyle('left: 0%');
    expect(pan).toHaveStyle('left: 0%');
  });

  it('render knobs at right-most, when value is greater than maximum', () => {
    const [vol, pan] = renderFaders(100, 100);
    expect(vol).toHaveStyle('left: 100%');
    expect(pan).toHaveStyle('left: 100%');
  });
});
