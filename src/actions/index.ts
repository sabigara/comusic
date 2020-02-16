import { Backend } from '../Backend';

export const backend = new Backend();

export const createAction = (type: string, id: string) => {
  return {
    type: type,
    id: id,
  };
};
