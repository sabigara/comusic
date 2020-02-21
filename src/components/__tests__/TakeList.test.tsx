/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import * as Redux from 'react-redux';
import { shallow, mount } from 'enzyme';

import TakeList from '../TakeList';
import More from '../../atoms/More';
import TakeCtxMenu from '../TakeCtxMenu';
import * as TrackHooks from '../../hooks/tracks';
import * as TakeHooks from '../../hooks/takes';
import * as Selectors from '../../hooks/selectors';

jest.mock('../../AudioAPI/WebAudioAPI');
jest.mock('../../hooks/takes');

const mockTakes = [
  {
    id: '4c92e8b3-9456-4d8b-aec4-2d23b9bbaaff',
    name: 'with ride cymbal',
    trackId: '116c2e4e-ea34-49d7-8a2a-9b2da03d7048',
    file: '16229d8b-e4e3-41e6-85e3-5ce847ae7fa4',
  },
  {
    id: '7599b9e5-6055-4917-b183-e59bd4ec429e',
    name: 'with hihat',
    trackId: '116c2e4e-ea34-49d7-8a2a-9b2da03d7048',
    file: '21c64940-fbca-470d-9b5d-99db5c98efee',
  },
];

function mockHooks() {
  const mockUseTakes = jest
    .spyOn(Selectors, 'useTakes')
    .mockReturnValue(mockTakes as any);
  const mockActiveTakeId = jest
    .spyOn(Selectors, 'useActiveTakeId')
    .mockReturnValue('4c92e8b3-9456-4d8b-aec4-2d23b9bbaaff');
  const mockUseAddTake = jest.spyOn(TakeHooks, 'useAddTake');
  const mockUseDispatch = jest.spyOn(Redux, 'useDispatch');
  const mockUseState = jest.spyOn(React, 'useState');
  const mockUseCallback = jest.spyOn(React, 'useCallback');
  // Just pass through the given function.
  mockUseCallback.mockImplementation((fn: any) => fn);
  const mockChangeActiveTake = jest.fn();
  jest
    .spyOn(TrackHooks, 'useChangeActiveTake')
    .mockReturnValue(mockChangeActiveTake);
  return {
    mockUseState,
    mockUseCallback,
    mockUseDispatch,
    mockUseTakes,
    mockUseAddTake,
    mockActiveTakeId,
    mockChangeActiveTake,
  };
}

function shallowRender() {
  return shallow(<TakeList trackId={'116c2e4e-ea34-49d7-8a2a-9b2da03d7048'} />);
}

describe('TakeList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should match the snapshot', () => {
    mockHooks();
    const container = shallowRender();
    expect(container).toMatchSnapshot();
  });

  it('has take-button named "with ride cymbal activated"', () => {
    mockHooks();
    const container = shallowRender();
    const takeBtn = container.find('.take-button').first();
    expect(takeBtn.text()).toBe('with ride cymbal');
    expect(takeBtn.prop('isActive')).toBe(true);
  });

  it('calls changeActiveTake with proper takeId', () => {
    const { mockChangeActiveTake } = mockHooks();
    const container = shallowRender();
    const takeBtn1 = container.find('.take-button').at(0);
    const takeBtn2 = container.find('.take-button').at(1);
    // Shouldn't be called to prevent unnecessary update.
    takeBtn1.simulate('click');
    expect(mockChangeActiveTake.mock.calls.length).toBe(0);
    takeBtn2.simulate('click');
    expect(mockChangeActiveTake.mock.calls[0][0]).toBe(
      '7599b9e5-6055-4917-b183-e59bd4ec429e',
    );
  });

  it('prints More component on mouse enter', () => {
    mockHooks();
    const container = shallowRender();
    const takeBtn = container.find('.take-button').first();
    takeBtn.simulate('mouseenter');
    expect(container).toMatchSnapshot();
  });

  it('shows more icon on mouse enter and hide on leave', () => {
    mockHooks();
    const container = shallowRender();
    const takeBtn = container.find('.take-button').first();
    takeBtn.simulate('mouseenter');
    // takeBtn.contains(<More />) should be true, but it doesn't
    // contain any under TackCtxMenu. So instead assert by container.
    expect(container.contains(<More />)).toBe(true);
    takeBtn.simulate('mouseleave');
    expect(takeBtn.contains(<More />)).toBe(false);
  });

  it('calls addTake() with proper args', () => {
    const { mockUseAddTake } = mockHooks();
    const mockAddTake = jest.fn();
    mockUseAddTake.mockReturnValue(mockAddTake);
    const container = shallowRender();
    const input = container.find('input').first();
    input.simulate('change', {
      target: {
        files: [{ name: 'dummy.wav' }],
      },
    });
    expect(mockAddTake.mock.calls.length).toBe(1);
    expect(mockAddTake.mock.calls[0][0]).toBe(
      '116c2e4e-ea34-49d7-8a2a-9b2da03d7048',
    );
    const body = mockAddTake.mock.calls[0][1];
    expect(body.get('name')).toBe('dummy.wav');
  });
});
