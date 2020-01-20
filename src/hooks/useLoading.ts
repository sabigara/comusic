import { useSelector } from 'react-redux';

export default (action: string, id?: string) => {
  return useSelector((state: any) => {
    if (state.loading[action] === undefined) {
        return true;
    }
    if (id) {
      return state.loading[action].filter(_id => _id === id).length > 0;
    } else {
      return state.loading[action].length > 0;
    }
  });
};
