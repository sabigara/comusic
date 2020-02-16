import { BackendAPI } from '../BackendAPI';

export const backendAPI = new BackendAPI();

export const createAction = (type: string, id: string, err?: string) => {
  return {
    type: type,
    id: id,
    err: err,
  };
};
