/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import {
  render,
  fireEvent,
  getByText as GetByText,
} from '@testing-library/react';

import { ActionTypeName as ATN, createAction } from '../../actions';
import { delTakeSuccess } from '../../actions/takes';
import Color from '../../common/Color';
import getReducers from '../../reducers';
import * as TakeHooks from '../../hooks/takes';
import TakeList from '../TakeList';

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
    store = createStore(getReducers(), mockState);
  }
  return render(
    <Provider store={store}>
      <TakeList trackId={'86017d4b-fb33-46ce-b3db-29a4300448f3'} />
    </Provider>,
  );
}

describe('TakeList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('changes button color on non-active button click', () => {
    const { getByTestId } = renderWithRedux();
    const btn1 = getByTestId(
      `take-button-11e44e9d-4ef7-40cc-ba5b-24338bff14e0`,
    );
    const btn2 = getByTestId(
      `take-button-54027b56-8047-4180-9d4a-5db5c7c7ed6e`,
    );
    // btn1 is active.
    expect(btn1).toHaveStyle(`background-color: ${Color.Button.MuteOn}`);
    expect(btn2).toHaveStyle(`background-color: ${Color.Button.Disabled}`);
    // btn2 should be active, and btn1 should be turned-off.
    fireEvent.click(btn2);
    expect(btn1).toHaveStyle(`background-color: ${Color.Button.Disabled}`);
    expect(btn2).toHaveStyle(`background-color: ${Color.Button.MuteOn}`);
    // Should not change since btn2's already active.
    fireEvent.click(btn2);
    expect(btn1).toHaveStyle(`background-color: ${Color.Button.Disabled}`);
    expect(btn2).toHaveStyle(`background-color: ${Color.Button.MuteOn}`);
  });

  it('shows more icon on mouse enter and hide on leave', () => {
    const { getByTestId } = renderWithRedux();
    const takeBtn = getByTestId(
      `take-button-11e44e9d-4ef7-40cc-ba5b-24338bff14e0`,
    );
    fireEvent.mouseEnter(takeBtn);
    expect(takeBtn.querySelector('.more')).not.toBeNull();
    fireEvent.mouseLeave(takeBtn);
    expect(takeBtn.querySelector('.more')).toBeNull();
  });

  it('calls addTake() with proper args', () => {
    const mockUseAddTake = jest.spyOn(TakeHooks, 'useAddTake');
    const mockAddTake = jest.fn();
    mockUseAddTake.mockReturnValue(mockAddTake);
    const { container } = renderWithRedux();
    const input = container.querySelector('input')!;
    fireEvent.change(input, {
      target: {
        files: [{ name: 'dummy.wav' }],
      },
    });
    expect(mockAddTake.mock.calls.length).toBe(1);
    expect(mockAddTake.mock.calls[0][0]).toBe(
      '86017d4b-fb33-46ce-b3db-29a4300448f3',
    );
    const body = mockAddTake.mock.calls[0][1];
    expect(body.get('name')).toBe('dummy.wav');
  });

  it('deletes a take by clicking ctx menu item', () => {
    const store = createStore(getReducers(), mockState);
    // Replace custom hook that returns async function with
    // one returns synchronous version.
    const mockUseDelTake = jest.spyOn(TakeHooks, 'useDelTake');
    const mockDelTake = jest.fn().mockImplementation((takeId: string) => {
      store.dispatch(createAction(ATN.Take.DEL_TAKE_REQUEST, takeId));
      store.dispatch(delTakeSuccess(takeId));
    });
    mockUseDelTake.mockReturnValue(mockDelTake);

    const { container, getByTestId } = renderWithRedux(store);
    expect(container.querySelectorAll('.take-button').length).toBe(2);
    const takeBtn = getByTestId(
      'take-button-11e44e9d-4ef7-40cc-ba5b-24338bff14e0',
    );
    fireEvent.mouseEnter(takeBtn);
    fireEvent.click(takeBtn.querySelector('.more')!);
    fireEvent.click(GetByText(takeBtn, 'Delete'));
    expect(container.querySelectorAll('.take-button').length).toBe(1);
  });
});
