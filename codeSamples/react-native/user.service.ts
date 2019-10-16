import {
  UserApi,
  UserApiResponse,
} from '../api/user.api';
import { User } from '@src/core/model';

export class UserService {

  api: UserApi;

  constructor() {
    this.api = new UserApi();
  }

  public getCurrentUser(): Promise<UserApiResponse> {
    return this.api.getCurrentUser();
  }

  public updateCurrentUser(user: User): Promise<User> {
    return this.api.updateCurrentUser(user);
  }

  public getUsers(): Promise<User[]> {
    return this.api.getUsers();
  }

  public deleteUser(id: number): Promise<{ success: boolean, id: number }> {
    return this.api.deleteUser(id);
  }

  public editUser(id: number, user: User): Promise<User> {
    return this.api.editUser(id, user);
  }

  public addUser(user: User): Promise<User> {
    return this.api.addUser(user);
  }
}
