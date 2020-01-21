const ADD_FILE = 'ADD_FILE' as const;
const RENAME_FILE = 'RENAME_FILE' as const;

export const ActionTypeName = {
  ADD_FILE,
  RENAME_FILE,
};

export const addFile = () => {
  return {
    type: ADD_FILE,
  };
};

export const renameFile = (id: string, name: string) => {
  return {
    type: RENAME_FILE,
    id: id,
    payload: {
      name: name,
    },
  };
};

export type ActionUnionType =
  | ReturnType<typeof addFile>
  | ReturnType<typeof renameFile>;
