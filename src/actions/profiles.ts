import { Profile } from '../common/Domain';
import { Resource } from '.';

const FETCH_PROFILE_REQUEST = 'FETCH_PROFILE_REQUEST' as const;
const FETCH_PROFILE_SUCCESS = 'FETCH_PROFILE_SUCCESS' as const;
const FETCH_PROFILE_FAILURE = 'FETCH_PROFILE_FAILURE' as const;
const FETCH_STUDIO_MEMBERS = 'FETCH_STUDIO_MEMBERS' as const;

export const ProfileActionTypeName = {
  FETCH_PROFILE_REQUEST,
  FETCH_PROFILE_SUCCESS,
  FETCH_PROFILE_FAILURE,
  FETCH_STUDIO_MEMBERS,
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

export const fetchStudioMembers = (memberProfiles: Resource<Profile>) => {
  return {
    type: FETCH_STUDIO_MEMBERS,
    payload: {
      profiles: memberProfiles,
    },
  };
};

export type ProfileActionUnionType =
  | ReturnType<typeof fetchProfileSuccess>
  | ReturnType<typeof fetchStudioMembers>;
