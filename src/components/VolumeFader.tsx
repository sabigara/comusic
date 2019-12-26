import React from 'react';
import { useIsFocusVisible } from '../common/useIsFocusVisible';
import useEventCallback from '../common/useEventCallback';
import styled from 'styled-components';


function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(min, value), max);
}

function trackFinger(event, touchId) {
  if (touchId.current !== undefined && event.changedTouches) {
    for (let i = 0; i < event.changedTouches.length; i += 1) {
      const touch = event.changedTouches[i];
      if (touch.identifier === touchId.current) {
        return {
          x: touch.clientX,
          y: touch.clientY,
        };
      }
    }

    return false;
  }

  return {
    x: event.clientX,
    y: event.clientY,
  };
}

function valueToPercent(value: number, min: number, max: number) {
  return ((value - min) * 100) / (max - min);
}

function percentToValue(percent: number, min: number, max: number) {
  return (max - min) * percent + min;
}

function getDecimalPrecision(num: number) {
  // This handles the case when num is very small (0.00000001), js will turn this into 1e-8.
  // When num is bigger than 1 or less than -1 it won't get converted to this notation so it's fine.
  if (Math.abs(num) < 1) {
    const parts = num.toExponential().split('e-');
    const matissaDecimalPart = parts[0].split('.')[1];
    return (matissaDecimalPart ? matissaDecimalPart.length : 0) + parseInt(parts[1], 10);
  }

  const decimalPart = num.toString().split('.')[1];
  return decimalPart ? decimalPart.length : 0;
}

function roundValueToStep(value: number, step: number, min: number) {
  const nearest = Math.round((value - min) / step) * step + min;
  return Number(nearest.toFixed(getDecimalPrecision(step)));
}

function focusThumb({ sliderRef, activeIndex, setActive }) {
  if (
    !sliderRef.current.contains(document.activeElement) ||
    Number(document?.activeElement?.getAttribute('data-index')) !== activeIndex
  ) {
    sliderRef.current.querySelector(`[data-index="${activeIndex}"]`).focus();
  }

  if (setActive) {
    setActive(activeIndex);
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
  onChange: Function,
  onChangeCommitted: Function,
  onMouseDown: Function,
  orientation: 'horizontal' | 'vertical',
  max: number,
  min: number,
  step: number,
  value: number,
}

const Slider = (props: Props) => {
  const {
    max = 100,
    min = 0,
    onChange,
    onChangeCommitted,
    onMouseDown,
    orientation = 'horizontal',
    step = 0.1,
    value: valueProp
  } = props;

  const value = clamp(valueProp, min, max);
  const touchId = React.useRef();
  // We can't use the :active browser pseudo-classes.
  // - The active state isn't triggered when clicking on the rail.
  // - The active state isn't transfered when inversing a range slider.
  const [active, setActive] = React.useState(-1);

  const { isFocusVisible, onBlurVisible, ref: focusVisibleRef } = useIsFocusVisible();
  const [focusVisible, setFocusVisible] = React.useState(-1);

  const sliderRef = React.useRef<HTMLDivElement>(null);

  const handleFocus = useEventCallback(event => {
    const index = Number(event.currentTarget.getAttribute('data-index'));
    if (isFocusVisible(event)) {
      setFocusVisible(index);
    }
  });
  const handleBlur = useEventCallback(() => {
    if (focusVisible !== -1) {
      setFocusVisible(-1);
      onBlurVisible();
    }
  });
  const handleMouseOver = useEventCallback(event => {
  });
  const handleMouseLeave = useEventCallback(() => {
  });  
  let axis = orientation;

  const getFingerNewValue = React.useCallback(
    ({ finger, source }) => {
      const { current: slider } = sliderRef;
      if (slider === null) {
        return { newValue: source, activeIndex: 0}
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
      let activeIndex = 0;

      return { newValue, activeIndex };
    },
    [max, min, axis, step],
  );

  const handleTouchMove = useEventCallback(event => {
    const finger = trackFinger(event, touchId);

    if (!finger) {
      return;
    }

    const { newValue, activeIndex } = getFingerNewValue({
      finger,
      move: true,
      source: value,
    });

    focusThumb({ sliderRef, activeIndex, setActive });
    if (onChange) {
      onChange(event, newValue);
    }
  });

  const handleTouchEnd = useEventCallback(event => {
    const finger = trackFinger(event, touchId);

    if (!finger) {
      return;
    }

    const { newValue } = getFingerNewValue({ finger, source: value });

    setActive(-1);

    if (onChangeCommitted) {
      onChangeCommitted(event, newValue);
    }

    touchId.current = undefined;
    document.body.removeEventListener('mousemove', handleTouchMove);
    document.body.removeEventListener('mouseup', handleTouchEnd);
    // eslint-disable-next-line no-use-before-define
    document.body.removeEventListener('mouseenter', handleMouseEnter);
    document.body.removeEventListener('touchmove', handleTouchMove);
    document.body.removeEventListener('touchend', handleTouchEnd);
  });

  const handleMouseEnter = useEventCallback(event => {
    // If the slider was being interacted with but the mouse went off the window
    // and then re-entered while unclicked then end the interaction.
    if (event.buttons === 0) {
      handleTouchEnd(event);
    }
  });

  const handleTouchStart = useEventCallback(event => {
    // Workaround as Safari has partial support for touchAction: 'none'.
    event.preventDefault();
    const touch = event.changedTouches[0];
    if (touch != null) {
      // A number that uniquely identifies the current finger in the touch session.
      touchId.current = touch.identifier;
    }
    const finger = trackFinger(event, touchId);
    const { newValue, activeIndex } = getFingerNewValue({ finger, source: value });
    focusThumb({ sliderRef, activeIndex, setActive });

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

  const handleMouseDown = useEventCallback(event => {
    if (onMouseDown) {
      onMouseDown(event);
    }

    event.preventDefault();
    const finger = trackFinger(event, touchId);
    const { newValue, activeIndex } = getFingerNewValue({ finger, source: value });
    focusThumb({ sliderRef, activeIndex, setActive });

    if (onChange) {
      onChange(event, newValue);
    }

    document.body.addEventListener('mousemove', handleTouchMove);
    document.body.addEventListener('mouseenter', handleMouseEnter);
    document.body.addEventListener('mouseup', handleTouchEnd);
  });

  const percent = valueToPercent(value, min, max);
  const style = axisProps[axis].offset(percent);

  return (
    <Root
      ref={sliderRef}
      onMouseDown={handleMouseDown}
    >
      <Rail />
      <input value={value} name='volume-fader-value' type="hidden" />
      <KnobMotionRange>
        <Knob
          style={style}
          data-index={0}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onMouseOver={handleMouseOver}
          onMouseLeave={handleMouseLeave}
        />
      </KnobMotionRange>
    </Root>
  );
};

const Root = styled.div`
    height: 2;
    width: 100%;
    box-sizing: content-box;
    padding: 30px 0;
    display: inline-block;
    position: relative;
    cursor: pointer;
    touch-action: none;
    color: black;
    -webkit-tap-highlight-color: transparent;
`

const Rail = styled.span`
  display: block;
  position: absolute;
  width: 100%;
  height: 18px;
  border-radius: 10px;
  background-color: #666;
`;

const KnobMotionRange = styled.div`
  position: relative;
  height: 18px;
  margin: 0 7px;
`
const Knob = styled.span`
  position: absolute;
  width: 30px;
  height: 30px;
  margin-left: -15px;
  margin-top: -6px;
  box-sizing: border-box;
  border-radius: 50%;
  outline: 0;
  background-color: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  border: solid 1px;
  opacity: 0.7;
`

export default Slider;
