/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

import * as utils from '../../testutils';
import { useFetchVerContents } from '../versions';

// Mocking from function is not working so do it here.
const mockBackendAPI = {
  fetchVerContents: jest.fn(),
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

describe('useFetchVerContents', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches contents of a version, update state, and load track', async () => {
    const verId = 'fake-version-id';
    const mockResp = {
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
            activeTake: '54027b56-8047-4180-9d4a-5db5c7c7ed6e',
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
            url:
              'http://localhost:1323/uploads/59e651ce-7762-47da-bca8-bf4f4b49e2f3',
          },
          'a0a8bbfe-7cf8-4261-ac22-cf7ebe73b533': {
            url:
              'http://localhost:1323/uploads/a0a8bbfe-7cf8-4261-ac22-cf7ebe73b533',
          },
        },
        allIds: [
          'a0a8bbfe-7cf8-4261-ac22-cf7ebe73b533',
          '59e651ce-7762-47da-bca8-bf4f4b49e2f3',
        ],
      },
    };
    mockBackendAPI.fetchVerContents.mockResolvedValue(mockResp);
    mockAudioAPI.loadTrack.mockReturnValue(mockTrackAPI);
    // Render with empty state.
    const { unmount, store } = utils.renderHookWithRedux(
      () => useFetchVerContents(verId),
      {},
    );

    // Here, `await waitForNextUpdate()` will never resolve.
    // Doc says: "Returns a Promise that resolves the next time
    // the hook renders, commonly when state is updated as the
    // result of an asynchronous update."
    // But in our code, if backendAPI.fetchVerContents throws,
    // it's caught and error action is dispatched, so state should
    // be considered being updated.

    // For now, just sleep.
    await utils.sleep(500);

    // Assert backend API is mocked.
    expect(mockBackendAPI.fetchVerContents.mock.calls.length).toBe(1);
    // Assert translation from response into state is done properly.
    expect(store.getState().tracks).toStrictEqual(mockResp.tracks);
    expect(store.getState().takes).toStrictEqual(mockResp.takes);
    expect(store.getState().files).toStrictEqual(mockResp.files);
    // Assert methods of mockAudioAPI is called with proper args.
    const trackResp =
      mockResp.tracks.byId['86017d4b-fb33-46ce-b3db-29a4300448f3'];
    expect(mockAudioAPI.loadTrack.mock.calls[0][0]).toBe(trackResp.id);
    expect(mockTrackAPI.setVolume.mock.calls[0][0]).toBe(trackResp.volume);
    expect(mockTrackAPI.setPan.mock.calls[0][0]).toBe(trackResp.pan);

    // unmount testing hooks to check if clean-up function of useEffect is called.
    unmount();
    expect(mockTrackAPI.release.mock.calls.length).toBe(1);
  });

  it('fails to fetch contents of version', async () => {
    const verId = 'fake-version-id';
    mockBackendAPI.fetchVerContents.mockImplementation(() => {
      throw new Error();
    });
    mockAudioAPI.loadTrack.mockReturnValue(mockTrackAPI);
    // Render with empty state.
    const { unmount, store } = utils.renderHookWithRedux(
      () => useFetchVerContents(verId),
      {},
    );

    utils.sleep(500);

    // Assert backend API is mocked.
    expect(mockBackendAPI.fetchVerContents.mock.calls.length).toBe(1);
    expect(store.getState().tracks.allIds.length).toBe(0);
    // Assert mockAudioAPI is not called.
    expect(mockAudioAPI.loadTrack.mock.calls.length).toBe(0);
    // unmount testing hooks to check if clean-up function of useEffect is called.
    unmount();
    expect(mockTrackAPI.release.mock.calls.length).toBe(0);
  });
});
