const ADD_TAKE = 'ADD_TAKE' as const;
const RENAME_TAKE = 'RENAME_TAKE' as const;

export const ActionTypeName = {
  ADD_TAKE,
  RENAME_TAKE,
};

export const addTake = () => {
  return {
    type: ADD_TAKE,
  };
};

export const renameTake = (id: string, name: string) => {
  return {
    type: RENAME_TAKE,
    id: id,
    payload: {
      name: name,
    },
  };
};

export type ActionUnionType =
  | ReturnType<typeof addTake>
  | ReturnType<typeof renameTake>;
