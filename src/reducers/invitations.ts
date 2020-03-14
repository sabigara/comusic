import { combineReducers } from 'redux';

import { Invitation, GroupType } from '../common/Domain';
import { uniqueArray } from '../common/utils';
import { ActionTypeName, ActionUnionType } from '../actions';

export type InvitationState = Invitation;

const initialState: InvitationState = {
  id: '',
  createdAt: '',
  updatedAt: '',
  email: '',
  groupId: '',
  isAccepted: false,
  groupType: GroupType.Err,
};

function invitation(
  state: InvitationState = initialState,
  action: ActionUnionType,
): InvitationState {
  switch (action.type) {
    case ActionTypeName.Invitation.ACCEPT_INVITATION:
      return {
        ...state,
        isAccepted: true,
      };
    default:
      return state;
  }
}
type ByIdState = {
  [id: string]: InvitationState;
};

function byId(state: ByIdState = {}, action: ActionUnionType): ByIdState {
  switch (action.type) {
    case ActionTypeName.Invitation.FETCH_INVITATIONS:
      return {
        ...state,
        ...action.payload.invitations.byId,
      };
    case ActionTypeName.Invitation.ADD_INVITATION:
      return {
        ...state,
        [action.payload.invitation.id]: action.payload.invitation,
      };
    case ActionTypeName.Invitation.ACCEPT_INVITATION:
      return {
        ...state,
        [action.payload.id]: invitation(state[action.payload.id], action),
      };
    default:
      return state;
  }
}

function allIds(state: string[] = [], action: ActionUnionType): string[] {
  switch (action.type) {
    case ActionTypeName.Invitation.FETCH_INVITATIONS:
      return uniqueArray(state.concat(action.payload.invitations.allIds));
    case ActionTypeName.Invitation.ADD_INVITATION:
      return uniqueArray(state.concat(action.payload.invitation.id));
    default:
      return state;
  }
}

export type InvitationCombinedState = {
  byId: ByIdState;
  allIds: string[];
};

export default combineReducers({
  byId,
  allIds,
});
