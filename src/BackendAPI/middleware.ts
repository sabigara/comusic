export const setBearerToken = (getToken: () => string | Promise<string>) => {
  return async (req: Request) => {
    const token = await getToken();
    req.headers.set('Authorization', 'Bearer ' + token);
    return req;
  };
};
