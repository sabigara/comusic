import React, { useMemo } from 'react';
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
  wavePeak?: number,
  type: 'volume' | 'pan',
  railHeight: number,
  width?: number,
  knobHeight: number,
  knobWidth: number,
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
    value: valueProp,
    wavePeak,
    type,
    railHeight,
    width,
    knobHeight = 18,
    knobWidth = 18,
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
  }},[type, railHeight, knobHeight, knobWidth]);

  const percent = valueToPercent(value, min, max);
  const style = axisProps[axis].offset(percent);
  const Knob = type === 'volume' ? VolumeKnob : PanKnob;

  return (
    <Root
      onMouseDown={handleMouseDown}
      type={type}
      width={width}
    >
      <Rail height={railHeight} type={type}>
        <KnobMotionRange ref={sliderRef}>
          {type === 'volume' ? <WavePeak value={wavePeak}/> : null}
          <Knob
            style={style}
            data-index={0}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onMouseOver={handleMouseOver}
            onMouseLeave={handleMouseLeave}
            height={knobHeight}
            width={knobWidth}
            {...calculateKnobPosition()}
          />
        </KnobMotionRange>
        {type === 'pan' ? <Center/> : null}
      </Rail>
    </Root>
  );
};

const Root = styled.div<{type: 'volume' | 'pan', width?: number}>`
  width: ${props => props.width ? props.width + 'px' : 'auto'};
  box-sizing: content-box;
  margin: 10px;
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  touch-action: none;
  color: black;
  -webkit-tap-highlight-color: transparent;
  ${props => {
    return props.type === 'pan' ? `
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
    ` : null
  }}
`

const Rail = styled.div<{type: 'volume' | 'pan', height: number}>`
  width: calc(100% ${props => props.type === 'pan' ? '- 25px' : null}); /* Subtract the width of pseudo-elements */
  margin: 0 auto;
  height: ${props => props.height + 'px'};
  border-radius: 10px;
  background-color: #666;
`;

const KnobMotionRange = styled.div`
  position: relative;
  height: 100%;
  margin: 0 7px;
`;

const WavePeak = styled.div<{value?: number}>`
  background-color: #4CD964;
  height: 100%;
  width: ${props => props.value?.toString() + 'px'};
`;

const AbstractKnob =  styled.span<{height: number, width: number, marginTop: number, marginLeft: number}>`
  position: absolute;
  top: 0;
  margin-left: ${props => props.marginLeft + 'px'};
  margin-top: ${props => props.marginTop + 'px'};
  box-sizing: border-box;
  outline: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`

const VolumeKnob = styled(AbstractKnob)`
  width: ${props => props.width + 'px'};
  height: ${props => props.height + 'px'};
  background-color: #ddd;
  border-radius: 50%;
  border: solid 1px;
  opacity: 0.7;
`

const PanKnob = styled(AbstractKnob)`
  width: 0;
  height: 0;
  border-style: solid;
  border-width: ${props => `${props.height + 'px'} ${(props.width / 2) + 'px'} 0 ${(props.width / 2) + 'px'}`};
  border-color: #ddd transparent transparent transparent;
  opacity: 0.7;
`

const Center = styled.div`
  background-color: #666;
  width: 2px;
  height: 6px;
  margin: 3px auto;
`

export default Slider;
