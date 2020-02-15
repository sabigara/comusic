export const createAction = (type: string, id: string) => {
  return {
    type: type,
    id: id,
  };
};
