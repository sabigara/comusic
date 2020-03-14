import { useState, useCallback } from 'react';

export default <T>(
  callback: (...args: any[]) => Promise<T>,
  onSuccess?: ((val: T) => void) | (() => void),
  onError?: ((err: string) => void) | (() => void),
  onFinally?: () => void,
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [value, setValue] = useState<T | null>(null);
  const fn = useCallback(
    async (...args) => {
      setValue(null);
      setError('');
      setLoading(true);
      try {
        const resp = await callback(...args);
        setValue(resp);
        onSuccess && onSuccess(resp);
        return resp;
      } catch (err) {
        setError(err.toString());
        onError && onError(err.toString());
      } finally {
        setLoading(false);
        onFinally && onFinally();
      }
    },
    [setValue, setLoading, setError, callback],
  );
  return { callback: fn, value, setValue, error, loading };
};
