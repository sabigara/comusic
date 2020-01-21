import { useEffect, useRef } from 'react';

export default <T>(value: T, defaultValue: T): T => {
  const ref = useRef(defaultValue);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};
