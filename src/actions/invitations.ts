import { Invitation } from '../common/Domain';
import { Resource } from '.';

const FETCH_INVITATIONS = 'FETCH_INVITATIONS' as const;
const ADD_INVITATION = 'ADD_INVITATION' as const;
const ACCEPT_INVITATION = 'ACCEPT_INVITATION' as const;

export const InvitationActionTypeName = {
  FETCH_INVITATIONS,
  ADD_INVITATION,
  ACCEPT_INVITATION,
};

export const fetchInvitations = (invitations: Resource<Invitation>) => {
  return {
    type: FETCH_INVITATIONS,
    payload: {
      invitations,
    },
  };
};

export const addInvitation = (invitation: Invitation) => {
  return {
    type: ADD_INVITATION,
    payload: {
      invitation,
    },
  };
};

export const acceptInvitation = (id: string) => {
  return {
    type: ACCEPT_INVITATION,
    payload: {
      id,
    },
  };
};

export type InvitationActionUnionType =
  | ReturnType<typeof fetchInvitations>
  | ReturnType<typeof addInvitation>
  | ReturnType<typeof acceptInvitation>;
