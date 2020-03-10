import React, { useState, useRef } from 'react';
import styled from 'styled-components';

type Props = {
  text: string;
  setText: Function;
  textColor?: string;
  fontSize?: string;
};

const EditableLabel: React.FC<Props> = (props) => {
  const { text, setText, textColor, fontSize } = props;

  const [showsInput, setShowsInput] = useState(false);
  const inputRef: any = useRef(null);

  return (
    <div>
      <StyledLabel
        isShown={!showsInput}
        color={textColor}
        fontSize={fontSize}
        onDoubleClick={() => {
          setShowsInput(true);
          setTimeout(() => {
            inputRef.current.focus();
          }, 1);
        }}
      >
        {text ? text : '_'}
      </StyledLabel>
      <StyledInput
        ref={inputRef}
        type="text"
        isShown={showsInput}
        placeholder={text}
        onBlur={(e) => {
          e.currentTarget.value = '';
          setShowsInput(false);
        }}
        onKeyDown={(e) => {
          if (e.keyCode === 13) {
            setText(e.currentTarget.value);
            setShowsInput(false);
          }
        }}
      />
    </div>
  );
};

const StyledLabel = styled.span<{
  isShown: boolean;
  color?: string;
  fontSize?: string;
}>`
  display: ${(props) => (props.isShown ? 'inline' : 'none')};
  color: ${(props) => props.color || 'white'};
  font-size: ${(props) => props.fontSize || '14px'};
  cursor: text;
`;

const StyledInput = styled.input<{ isShown: boolean }>`
  display: ${(props) => (props.isShown ? 'inline' : 'none')};
`;

export default EditableLabel;
