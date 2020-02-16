import { BackendAPI } from '../BackendAPI';

export const backendAPI = new BackendAPI();

export const createAction = (type: string, id: string) => {
  return {
    type: type,
    id: id,
  };
};
