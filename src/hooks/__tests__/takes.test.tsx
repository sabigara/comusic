/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Provider } from 'react-redux';
import { renderHook, act } from '@testing-library/react-hooks';

import * as utils from '../../testutils';
import { useAddTake, useDelTake } from '../takes';

const mockBackendAPI = {
  addTake: jest.fn(),
  delTake: jest.fn(),
};
jest.mock('../useBackendAPI', () => {
  return () => {
    return mockBackendAPI;
  };
});

const mockTrackAPI = {
  stop: jest.fn(),
  clearBuffer: jest.fn(),
};
const mockAudioAPI = {
  getTrack: jest.fn().mockReturnValue(mockTrackAPI),
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
      '59e651ce-7762-47da-bca8-bf4f4b49e2f3': {
        url: 'some-url',
      },
    },
    allIds: ['59e651ce-7762-47da-bca8-bf4f4b49e2f3'],
  },
};

function renderHookWithRedux<P, R>(callback: (props: P) => R, state?: any) {
  const store = utils.initStore(state || mockState, true);
  const wrapper: React.FC = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  );
  return { ...renderHook<P, R>(callback, { wrapper }), store };
}

describe('useAddTake', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('adds a take successfully', async () => {
    const trackId = '86017d4b-fb33-46ce-b3db-29a4300448f3';
    const mockResp = {
      take: {
        id: '54027b56-8047-4180-9d4a-5db5c7c7ed6e',
        createdAt: '2020-02-21T05:12:03Z',
        updatedAt: '2020-02-21T05:12:03Z',
        trackId: trackId,
        name: 'drs-tk2',
        fileId: '59e651ce-7762-47da-bca8-bf4f4b49e2f3',
      },
      file: {
        id: 'a0a8bbfe-7cf8-4261-ac22-cf7ebe73b533',
        url: 'some-url',
      },
    };
    mockBackendAPI.addTake.mockResolvedValue(mockResp);
    // Render with empty state.
    const { result, store } = renderHookWithRedux(() => useAddTake(), {});
    const formData = new FormData();
    formData.append('key', 'val');

    await act(async () => {
      await result.current(trackId, formData);
    });

    // Assert backend API is mocked.
    expect(mockBackendAPI.addTake.mock.calls.length).toBe(1);
    // Assert backend API is called with correct args.
    expect(mockBackendAPI.addTake.mock.calls[0][0]).toBe(trackId);
    expect(mockBackendAPI.addTake.mock.calls[0][1]).toBe(formData);
    // Assert action creators and reducers work fine.
    expect(store.getState().takes.byId[mockResp.take.id]).toBe(mockResp.take);
    expect(store.getState().files.byId[mockResp.file.id]).toBe(mockResp.file);
    expect(store.getState().takes.allIds.length).toBe(1);
    expect(store.getState().files.allIds.length).toBe(1);
  });

  it('fails with backedAPI error', async () => {
    const trackId = '86017d4b-fb33-46ce-b3db-29a4300448f3';
    mockBackendAPI.addTake.mockImplementation(() => {
      throw new Error();
    });
    // Render with empty state.
    const { result, store } = renderHookWithRedux(() => useAddTake(), {});
    const formData = new FormData();
    formData.append('key', 'val');

    await act(async () => {
      await result.current(trackId, formData);
    });

    // Assert backend API is mocked.
    expect(mockBackendAPI.addTake.mock.calls.length).toBe(1);
    // Assert backend API is called with correct args.
    expect(mockBackendAPI.addTake.mock.calls[0][0]).toBe(trackId);
    expect(mockBackendAPI.addTake.mock.calls[0][1]).toBe(formData);
    // Assert nothing happens.
    expect(store.getState().takes.allIds.length).toBe(0);
    expect(store.getState().files.allIds.length).toBe(0);
  });
});

describe('useDelTake', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('delete a take successfully', async () => {
    const { result, store } = renderHookWithRedux(() => useDelTake());
    const takeIdToDel = '11e44e9d-4ef7-40cc-ba5b-24338bff14e0';
    await act(async () => {
      await result.current(takeIdToDel);
    });

    // Assert backend API is mocked.
    expect(mockBackendAPI.delTake.mock.calls.length).toBe(1);
    // Assert backend API is called with correct args.
    expect(mockBackendAPI.delTake.mock.calls[0][0]).toBe(takeIdToDel);
    // Assert action creators and reducers work fine.
    expect(store.getState().takes.allIds.length).toBe(0);
    // File is not immediately deleted since it may be
    // tied with other take.
    expect(mockTrackAPI.stop.mock.calls.length).toBe(1);
    expect(mockTrackAPI.clearBuffer.mock.calls.length).toBe(1);
  });

  it('fails to delete due to backedAPI error', async () => {
    mockBackendAPI.delTake.mockImplementation(() => {
      throw new Error();
    });
    // Render with empty state.
    const { result, store } = renderHookWithRedux(() => useDelTake());

    await act(async () => {
      await result.current('fake');
    });

    // Assert backend API is mocked.
    expect(mockBackendAPI.delTake.mock.calls.length).toBe(1);
    // Assert backend API is called with correct args.
    expect(mockBackendAPI.delTake.mock.calls[0][0]).toBe('fake');
    // Assert nothing happens.
    expect(store.getState().takes.allIds.length).toBe(1);
    expect(mockTrackAPI.stop.mock.calls.length).toBe(0);
    expect(mockTrackAPI.clearBuffer.mock.calls.length).toBe(0);
  });
});
