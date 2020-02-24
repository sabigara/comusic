/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { act } from '@testing-library/react-hooks';

import * as utils from '../../testutils';
import {
  useAddTrack,
  useDelTrack,
  useUpdateTrackParam,
  useSwitchMuteSolo,
  useLoadActiveTake,
} from '../tracks';
import { TrackParam } from '../../common/Domain';

// Mocking from function is not working so do it here.
const mockBackendAPI = {
  addTrack: jest.fn(),
  delTrack: jest.fn(),
};
jest.mock('../useBackendAPI', () => {
  return () => {
    return mockBackendAPI;
  };
});

const mockTrackAPI = {
  setVolume: jest.fn(),
  setPan: jest.fn(),
  release: jest.fn(),
  stop: jest.fn(),
  clearBuffer: jest.fn(),
  loadFile: jest.fn(),
};
const mockAudioAPI = {
  getTrack: jest.fn(),
  loadTrack: jest.fn(),
};
jest.mock('../../AudioAPI/WebAudioAPI');
jest.mock('../useAudioAPI', () => {
  return () => {
    return mockAudioAPI;
  };
});

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
    },
    allIds: ['11e44e9d-4ef7-40cc-ba5b-24338bff14e0'],
  },
  files: {
    byId: {
      'a0a8bbfe-7cf8-4261-ac22-cf7ebe73b533': {
        url: 'some-url',
      },
    },
    allIds: ['59e651ce-7762-47da-bca8-bf4f4b49e2f3'],
  },
};

describe('useAddTrack', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('adds a track successfully', async () => {
    const verId = 'fake-version-id';
    const mockResp = {
      id: '16fbffea-4916-44e0-810c-01cb32bc78f0',
      createdAt: '2020-02-21T05:09:13Z',
      updatedAt: '2020-02-21T05:11:05Z',
      versionId: '6f3291f3-ec12-409d-a3ba-09e813bd96ba',
      name: 'Bass',
      volume: 0.3,
      pan: -20,
      isMuted: false,
      isSoloed: false,
      icon: 0,
      activeTake: 'bf09b513-cf97-4aa6-b997-39288334cd6a',
    };
    mockBackendAPI.addTrack.mockResolvedValue(mockResp);
    mockAudioAPI.loadTrack.mockReturnValue(mockTrackAPI);
    // Render with empty state.
    const { result, store } = utils.renderHookWithRedux(
      () => useAddTrack(verId),
      {},
    );

    await act(async () => {
      await result.current();
    });

    // Assert backend API is mocked.
    expect(mockBackendAPI.addTrack.mock.calls.length).toBe(1);
    // Assert action creators and reducers work fine.
    expect(store.getState().tracks.byId[mockResp.id]).toBe(mockResp);
    expect(store.getState().tracks.allIds.length).toBe(1);
    // Assert methods of mockAudioAPI is called with proper args.
    expect(mockAudioAPI.loadTrack.mock.calls[0][0]).toBe(mockResp.id);
    expect(mockTrackAPI.setVolume.mock.calls[0][0]).toBe(mockResp.volume);
    expect(mockTrackAPI.setPan.mock.calls[0][0]).toBe(mockResp.pan);
  });

  it('fails to add a track due to backedAPI error', async () => {
    const verId = 'fake-version-id';
    mockBackendAPI.addTrack.mockImplementation(() => {
      throw new Error();
    });
    mockAudioAPI.loadTrack.mockReturnValue(mockTrackAPI);
    // Render with empty state.
    const { result, store } = utils.renderHookWithRedux(
      () => useAddTrack(verId),
      {},
    );

    await act(async () => {
      await result.current();
    });

    // Assert backend API is mocked.
    expect(mockBackendAPI.addTrack.mock.calls.length).toBe(1);
    // Assert nothing happens.
    expect(store.getState().tracks.allIds.length).toBe(0);
    // Assert methods of mockAudioAPI is not called
    expect(mockAudioAPI.loadTrack.mock.calls.length).toBe(0);
    expect(mockTrackAPI.setVolume.mock.calls.length).toBe(0);
    expect(mockTrackAPI.setPan.mock.calls.length).toBe(0);
  });
});

describe('useDelTake', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('delete a track successfully', async () => {
    const { result, store } = utils.renderHookWithRedux(
      () => useDelTrack(),
      mockState,
    );
    const trackIdToDel = '86017d4b-fb33-46ce-b3db-29a4300448f3';
    mockAudioAPI.getTrack.mockReturnValue(mockTrackAPI);
    await act(async () => {
      await result.current(trackIdToDel);
    });

    // Assert backend API is mocked.
    expect(mockBackendAPI.delTrack.mock.calls.length).toBe(1);
    // Assert backend API is called with correct args.
    expect(mockBackendAPI.delTrack.mock.calls[0][0]).toBe(trackIdToDel);
    // Assert action creators and reducers work fine.
    expect(store.getState().tracks.allIds.length).toBe(0);
    expect(store.getState().takes.allIds.length).toBe(0);
    expect(mockAudioAPI.getTrack.mock.calls[0][0]).toBe(
      '86017d4b-fb33-46ce-b3db-29a4300448f3',
    );
    expect(mockTrackAPI.release.mock.calls.length).toBe(1);
  });

  it('fails to delete due to backedAPI error', async () => {
    const { result, store } = utils.renderHookWithRedux(
      () => useDelTrack(),
      mockState,
    );
    const trackIdToDel = '86017d4b-fb33-46ce-b3db-29a4300448f3';
    mockBackendAPI.delTrack.mockImplementation(() => {
      throw new Error();
    });
    mockAudioAPI.getTrack.mockReturnValue(mockTrackAPI);
    await act(async () => {
      await result.current(trackIdToDel);
    });

    // Assert backend API is mocked.
    expect(mockBackendAPI.delTrack.mock.calls.length).toBe(1);
    // Assert backend API is called with correct args.
    expect(mockBackendAPI.delTrack.mock.calls[0][0]).toBe(trackIdToDel);
    // Assert nothing happens.
    expect(store.getState().tracks.allIds.length).toBe(1);
    expect(store.getState().takes.allIds.length).toBe(1);
    expect(mockAudioAPI.getTrack.mock.calls.length).toBe(0);
    expect(mockTrackAPI.release.mock.calls.length).toBe(0);
  });
});

describe('useUpdateTrackParam', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('updates volume to 0.5', async () => {
    const { result, store } = utils.renderHookWithRedux(
      () => useUpdateTrackParam(),
      mockState,
    );
    const trackIdToUpdate = '86017d4b-fb33-46ce-b3db-29a4300448f3';
    mockAudioAPI.getTrack.mockReturnValue(mockTrackAPI);
    await act(async () => {
      await result.current(trackIdToUpdate, TrackParam.volume, 0.5);
    });

    // Assert action creators and reducers work fine.
    expect(store.getState().tracks.byId[trackIdToUpdate].volume).toBe(0.5);
    expect(mockAudioAPI.getTrack.mock.calls[0][0]).toBe(
      '86017d4b-fb33-46ce-b3db-29a4300448f3',
    );
    expect(mockTrackAPI.setVolume.mock.calls[0][0]).toBe(0.5);
  });

  it('updates pan to 0.5', async () => {
    const { result, store } = utils.renderHookWithRedux(
      () => useUpdateTrackParam(),
      mockState,
    );
    const trackIdToUpdate = '86017d4b-fb33-46ce-b3db-29a4300448f3';
    mockAudioAPI.getTrack.mockReturnValue(mockTrackAPI);
    await act(async () => {
      await result.current(trackIdToUpdate, TrackParam.pan, 0.5);
    });

    // Assert action creators and reducers work fine.
    expect(store.getState().tracks.byId[trackIdToUpdate].pan).toBe(0.5);
    expect(mockAudioAPI.getTrack.mock.calls[0][0]).toBe(
      '86017d4b-fb33-46ce-b3db-29a4300448f3',
    );
    expect(mockTrackAPI.setPan.mock.calls[0][0]).toBe(0.5);
  });
});

describe('useSwitchMuteSolo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('mutes, then unmutes', async () => {
    const trackIdToUpdate = '86017d4b-fb33-46ce-b3db-29a4300448f3';
    mockAudioAPI.getTrack.mockReturnValue(mockTrackAPI);
    const { result, store } = utils.renderHookWithRedux(
      () => useSwitchMuteSolo(trackIdToUpdate),
      mockState,
    );

    act(() => result.current[0]());
    expect(store.getState().tracks.byId[trackIdToUpdate].isMuted).toBe(true);
    act(() => result.current[0]());
    expect(store.getState().tracks.byId[trackIdToUpdate].isMuted).toBe(false);
  });

  it('solos, then unsolos', async () => {
    const trackIdToUpdate = '86017d4b-fb33-46ce-b3db-29a4300448f3';
    mockAudioAPI.getTrack.mockReturnValue(mockTrackAPI);
    const { result, store } = utils.renderHookWithRedux(
      () => useSwitchMuteSolo(trackIdToUpdate),
      mockState,
    );

    act(() => result.current[1]());
    expect(store.getState().tracks.byId[trackIdToUpdate].isSoloed).toBe(true);
    act(() => result.current[1]());
    expect(store.getState().tracks.byId[trackIdToUpdate].isSoloed).toBe(false);
  });

  it('mutes and solos, then unmutes and unsolos', async () => {
    const trackIdToUpdate = '86017d4b-fb33-46ce-b3db-29a4300448f3';
    mockAudioAPI.getTrack.mockReturnValue(mockTrackAPI);
    const { result, store } = utils.renderHookWithRedux(
      () => useSwitchMuteSolo(trackIdToUpdate),
      mockState,
    );

    act(() => result.current[0]());
    act(() => result.current[1]());
    expect(store.getState().tracks.byId[trackIdToUpdate].isMuted).toBe(true);
    expect(store.getState().tracks.byId[trackIdToUpdate].isSoloed).toBe(true);

    act(() => result.current[0]());
    act(() => result.current[1]());
    expect(store.getState().tracks.byId[trackIdToUpdate].isMuted).toBe(false);
    expect(store.getState().tracks.byId[trackIdToUpdate].isSoloed).toBe(false);
  });
});

describe('useLoadActiveTake', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads file for active take', async () => {
    const trackIdToLoad = '86017d4b-fb33-46ce-b3db-29a4300448f3';
    mockAudioAPI.getTrack.mockReturnValue(mockTrackAPI);
    const { result } = utils.renderHookWithRedux(
      () => useLoadActiveTake(),
      mockState,
    );
    await act(async () => {
      await result.current(trackIdToLoad);
    });

    expect(mockTrackAPI.loadFile.mock.calls[0][0]).toBe('some-url');
  });
});
