import React, { useMemo } from 'react';
import useEventCallback from '../common/useEventCallback';
import styled from 'styled-components';

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(min, value), max);
}

function isTouchEvent(
  event: React.TouchEvent | React.MouseEvent,
): event is React.TouchEvent {
  return 'changedTouches' in event;
}

function trackFinger(
  event: React.TouchEvent | React.MouseEvent,
  touchId: React.MutableRefObject<number>,
): { x: number; y: number } | null {
  if (!isTouchEvent(event)) {
    return {
      x: event.clientX,
      y: event.clientY,
    };
  }
  if (touchId.current !== undefined && event.changedTouches) {
    for (let i = 0; i < event.changedTouches.length; i += 1) {
      const touch = event.changedTouches[i];
      if (touch.identifier === touchId.current) {
        return {
          x: touch.clientX,
          y: touch.clientY,
        };
      } else {
        return null;
      }
    }
  }
  return null;
}

function valueToPercent(value: number, min: number, max: number): number {
  return ((value - min) * 100) / (max - min);
}

function percentToValue(percent: number, min: number, max: number): number {
  return (max - min) * percent + min;
}

function getDecimalPrecision(num: number): number {
  // This handles the case when num is very small (0.00000001), js will turn this into 1e-8.
  // When num is bigger than 1 or less than -1 it won't get converted to this notation so it's fine.
  if (Math.abs(num) < 1) {
    const parts = num.toExponential().split('e-');
    const matissaDecimalPart = parts[0].split('.')[1];
    return (
      (matissaDecimalPart ? matissaDecimalPart.length : 0) +
      parseInt(parts[1], 10)
    );
  }

  const decimalPart = num.toString().split('.')[1];
  return decimalPart ? decimalPart.length : 0;
}

function roundValueToStep(value: number, step: number, min: number): number {
  const nearest = Math.round((value - min) / step) * step + min;
  return Number(nearest.toFixed(getDecimalPrecision(step)));
}

function focusThumb(
  sliderRef: React.RefObject<HTMLDivElement>,
  activeIndex: number,
): void {
  if (
    !sliderRef.current?.contains(document.activeElement) ||
    Number(document?.activeElement?.getAttribute('data-index')) !== activeIndex
  ) {
    const thumb = sliderRef.current?.querySelector(
      `[data-index="${activeIndex}"]`,
    );
    (thumb as HTMLElement).focus();
  }
}

const axisProps = {
  horizontal: {
    offset: (percent: number) => ({ left: `${percent}%` }),
  },
  'horizontal-reverse': {
    offset: (percent: number) => ({ right: `${percent}%` }),
  },
  vertical: {
    offset: (percent: number) => ({ bottom: `${percent}%` }),
  },
};

type Props = {
  onChange: (e: React.TouchEvent | React.MouseEvent, val: number) => void;
  onChangeCommitted?: (e: React.TouchEvent, val: number) => void;
  onMouseDown?: (e: React.MouseEvent) => void;
  orientation: 'horizontal' | 'vertical';
  max: number;
  min: number;
  step: number;
  value: number;
  wavePeak?: number;
  type: 'volume' | 'pan';
  railHeight: number;
  width?: number;
  knobHeight: number;
  knobWidth: number;
};

const Slider: React.FC<Props> = (props) => {
  const {
    max = 100,
    min = 0,
    onChange,
    onChangeCommitted,
    onMouseDown,
    orientation = 'horizontal',
    step = 0.1,
    value: valueProp,
    wavePeak,
    type,
    railHeight,
    width,
    knobHeight = 18,
    knobWidth = 18,
  } = props;

  const value = clamp(valueProp, min, max);
  // Store local state for `onChangeCommitted` callback.
  const [localValue, setLocalValue] = React.useState(value);
  const touchId = React.useRef<number>(-1);
  const sliderRef = React.useRef<HTMLDivElement>(null);
  const axis = orientation;

  const getFingerNewValue = React.useCallback(
    ({ finger, source }) => {
      const { current: slider } = sliderRef;
      if (slider === null) {
        return { newValue: source, activeIndex: 0 };
      }

      const { width, height, bottom, left } = slider.getBoundingClientRect();
      let percent: number;

      if (axis.indexOf('vertical') === 0) {
        percent = (bottom - finger.y) / height;
      } else {
        percent = (finger.x - left) / width;
      }

      if (axis.indexOf('-reverse') !== -1) {
        percent = 1 - percent;
      }

      let newValue: number;
      newValue = percentToValue(percent, min, max);
      newValue = roundValueToStep(newValue, step, min);
      newValue = clamp(newValue, min, max);
      const activeIndex = 0;

      return { newValue, activeIndex };
    },
    [max, min, axis, step],
  );

  const handleTouchMove = useEventCallback((event: React.TouchEvent) => {
    const finger = trackFinger(event, touchId);

    if (!finger) {
      return;
    }

    const { newValue, activeIndex } = getFingerNewValue({
      finger,
      move: true,
      source: value,
    });
    if (localValue === newValue) {
      return;
    }
    setLocalValue(newValue);

    focusThumb(sliderRef, activeIndex);
    if (onChange) {
      onChange(event, newValue);
    }
  });

  const handleTouchEnd = useEventCallback((event: React.TouchEvent) => {
    const finger = trackFinger(event, touchId);

    if (!finger) {
      return;
    }

    const { newValue } = getFingerNewValue({ finger, source: value });

    if (onChangeCommitted) {
      onChangeCommitted(event, newValue);
    }

    touchId.current = -1;
    document.body.removeEventListener('mousemove', handleTouchMove);
    document.body.removeEventListener('mouseup', handleTouchEnd);
    // eslint-disable-next-line no-use-before-define
    document.body.removeEventListener('touchmove', handleTouchMove);
    document.body.removeEventListener('touchend', handleTouchEnd);
  });

  const handleMouseEnter = useEventCallback((event: React.MouseEvent) => {
    // If the slider was being interacted with but the mouse went off the window
    // and then re-entered while unclicked then end the interaction.
    if (event.buttons === 0) {
      handleTouchEnd(event);
    }
  });

  const handleTouchStart = useEventCallback((event: React.TouchEvent) => {
    // Workaround as Safari has partial support for touchAction: 'none'.
    event.preventDefault();
    const touch = event.changedTouches[0];
    if (touch != null) {
      // A number that uniquely identifies the current finger in the touch session.
      touchId.current = touch.identifier;
    }
    const finger = trackFinger(event, touchId);
    const { newValue, activeIndex } = getFingerNewValue({
      finger,
      source: value,
    });
    focusThumb(sliderRef, activeIndex);

    if (onChange) {
      onChange(event, newValue);
    }

    document.body.addEventListener('touchmove', handleTouchMove);
    document.body.addEventListener('touchend', handleTouchEnd);
  });

  React.useEffect(() => {
    const { current: slider } = sliderRef;
    slider?.addEventListener('touchstart', handleTouchStart);

    return () => {
      slider?.removeEventListener('touchstart', handleTouchStart);
      document.body.removeEventListener('mousemove', handleTouchMove);
      document.body.removeEventListener('mouseup', handleTouchEnd);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
      document.body.removeEventListener('touchmove', handleTouchMove);
      document.body.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleMouseEnter, handleTouchEnd, handleTouchMove, handleTouchStart]);

  const handleMouseDown = useEventCallback((event: React.MouseEvent) => {
    if (onMouseDown) {
      onMouseDown(event);
    }

    event.preventDefault();
    const finger = trackFinger(event, touchId);
    const { newValue, activeIndex } = getFingerNewValue({
      finger,
      source: value,
    });
    setLocalValue(newValue);
    focusThumb(sliderRef, activeIndex);

    if (onChange) {
      onChange(event, newValue);
    }

    document.body.addEventListener('mousemove', handleTouchMove);
    document.body.addEventListener('mouseenter', handleMouseEnter);
    document.body.addEventListener('mouseup', handleTouchEnd);
  });

  const calculateKnobPosition = useMemo(() => {
    return () => {
      switch (type) {
        case 'volume': {
          const marginTop = -((knobHeight - railHeight) / 2);
          const marginLeft = -(knobWidth / 2);
          return { marginTop, marginLeft };
        }
        case 'pan': {
          const marginTop = -(knobHeight - railHeight);
          const marginLeft = -(knobWidth / 2);
          return { marginTop, marginLeft };
        }
      }
    };
  }, [type, railHeight, knobHeight, knobWidth]);

  // Use localValue because value is not updated
  // onChange but onChangeCommitted.
  const percent = valueToPercent(localValue, min, max);
  const style = axisProps[axis].offset(percent);
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const Knob = type === 'volume' ? VolumeKnob : PanKnob;

  return (
    <Root onMouseDown={handleMouseDown} type={type} width={width}>
      <Rail height={railHeight} type={type}>
        <KnobMotionRange ref={sliderRef}>
          {type === 'volume' ? <WavePeak value={wavePeak} /> : null}
          <Knob
            style={style}
            data-index={0}
            height={knobHeight}
            width={knobWidth}
            {...calculateKnobPosition()}
          />
        </KnobMotionRange>
        {type === 'pan' ? <Center /> : null}
      </Rail>
    </Root>
  );
};

const Root = styled.div<{ type: 'volume' | 'pan'; width?: number }>`
  width: ${(props) => (props.width ? props.width + 'px' : 'auto')};
  box-sizing: content-box;
  margin: 10px;
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  touch-action: none;
  color: black;
  -webkit-tap-highlight-color: transparent;
  ${(props) => {
    return props.type === 'pan'
      ? `
      &::before {
        content: 'L';
        margin-right: 4px;
        font-size: 12px;
        font-family: sans-serif;
      }
      &::after {
        content: 'R';
        margin-left: 4px;
        font-size: 12px;
        font-family: sans-serif;
      }
    `
      : null;
  }}
`;

const Rail = styled.div<{ type: 'volume' | 'pan'; height: number }>`
  /* Subtract the width of pseudo-elements */
  width: calc(100% ${(props) => (props.type === 'pan' ? '- 25px' : null)});
  margin: 0 auto;
  height: ${(props) => props.height + 'px'};
  border-radius: 10px;
  background-color: #666;
`;

const KnobMotionRange = styled.div`
  position: relative;
  height: 100%;
  margin: 0 7px;
`;

// Use `attrs` to prevent recomputing and creating new class
// every time the value changes.
const WavePeak = styled.div.attrs((props: { value?: number }) => ({
  style: {
    width: props.value ? props.value.toString() + 'px' : 0,
  },
}))<{ value?: number }>`
  background-color: #4cd964;
  height: 100%;
`;

const AbstractKnob = styled.span<{
  height: number;
  width: number;
  marginTop: number;
  marginLeft: number;
}>`
  position: absolute;
  top: 0;
  margin-left: ${(props) => props.marginLeft + 'px'};
  margin-top: ${(props) => props.marginTop + 'px'};
  box-sizing: border-box;
  outline: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const VolumeKnob = styled(AbstractKnob)`
  width: ${(props) => props.width + 'px'};
  height: ${(props) => props.height + 'px'};
  background-color: #ddd;
  border-radius: 50%;
  border: solid 1px;
  opacity: 0.7;
`;

const PanKnob = styled(AbstractKnob)`
  width: 0;
  height: 0;
  border-style: solid;
  border-width: ${(props) =>
    `${props.height + 'px'} ${props.width / 2 + 'px'} 0 ${props.width / 2 +
      'px'}`};
  border-color: #ddd transparent transparent transparent;
  opacity: 0.7;
`;

const Center = styled.div`
  background-color: #666;
  width: 2px;
  height: 6px;
  margin: 3px auto;
`;

export default Slider;
