import {
  SET_CURRENT_USER,
  SET_USERS,
  DELETE_USER,
  SET_USER,
  EDIT_USER,
  CREATE_USER,
  UserActionValueType,
} from './type';
import { User } from '@src/core/model';

export const setCurrentUser = (user: User): UserActionValueType => ({
  type: SET_CURRENT_USER,
  currentUser: user,
});

export const setUsers = (users: User[]): UserActionValueType => ({
  type: SET_USERS,
  users: users,
});

export const deleteUser = (id: number): UserActionValueType => ({
  type: DELETE_USER,
  removedId: id,
});

export const setUser = (user: User): UserActionValueType => ({
  type: SET_USER,
  user: user,
});

export const editUser = (user: User): UserActionValueType => ({
  type: EDIT_USER,
  user: user,
});

export const createUser = (user: User): UserActionValueType => ({
  type: CREATE_USER,
  user: user,
});
