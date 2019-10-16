import {
  UserActionValueType,
  SET_USERS,
  DELETE_USER,
  EDIT_USER,
  CREATE_USER,
} from '../actions';
import { User } from '@src/core/model';

const initialState: User[] = [];

export const users = (state: User[] = initialState,
                      action: UserActionValueType): User[] => {

  if (!action) {
    return state;
  }
  switch (action.type) {
    case SET_USERS:
      return action.users;
    case DELETE_USER:
      return deleteUser(state, action.removedId);
    case EDIT_USER:
      return editUsers(state, action.user);
    case CREATE_USER:
      return createUser(state, action.user);
    default:
      return state;
  }
};

function deleteUser(stateUsers: User[], id: number): User[] {
  const copy: User[] = [...stateUsers];
  const index: number = copy.findIndex((item: User) => item.id === id);
  if (index !== -1) {
    copy.splice(index, 1);
  }

  return copy;
}

function editUsers(stateUsers: User[], user: User): User[] {
  const copy: User[] = [...stateUsers];
  const index: number = copy.findIndex((item: User) => item.id === user.id);
  if (index !== -1) {
    copy[index] = user;
  }

  return copy;
}

function createUser(stateUsers: User[], newUser: User): User[] {
  const copy: User[] = [...stateUsers];
  copy.unshift(newUser);
  return copy;
}
