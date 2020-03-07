import { Profile } from '../common/Domain';

const FETCH_PROFILE_REQUEST = 'FETCH_PROFILE_REQUEST' as const;
const FETCH_PROFILE_SUCCESS = 'FETCH_PROFILE_SUCCESS' as const;
const FETCH_PROFILE_FAILURE = 'FETCH_PROFILE_FAILURE' as const;

export const ProfileActionTypeName = {
  FETCH_PROFILE_REQUEST,
  FETCH_PROFILE_SUCCESS,
  FETCH_PROFILE_FAILURE,
};

export const fetchProfileSuccess = (profile: Profile) => {
  return {
    type: FETCH_PROFILE_SUCCESS,
    id: profile.id,
    payload: {
      profile: profile,
    },
  };
};

export type ProfileActionUnionType = ReturnType<typeof fetchProfileSuccess>;
