import { useState, useCallback } from 'react';

export default <T>(
  callback: (...args: string[]) => Promise<T>,
): [(...args: string[]) => Promise<T | null>, T | null, string, boolean] => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [resp, setResp] = useState<T | null>(null);
  const fn = useCallback(
    async (...args: string[]) => {
      setError('');
      setResp(null);
      setLoading(true);
      try {
        setResp(await callback(...args));
      } catch (err) {
        setError(err.toString());
      } finally {
        setLoading(false);
        return resp;
      }
    },
    [setResp, setLoading, setError, callback],
  );
  return [fn, resp, error, loading];
};
