import {
  API_VERBS,
  ApiService,
} from '../core/http/api.service';
import { User } from '@src/core/model';

interface UserApiEndpoints {
  currentUser: string;
  getUsers: (page: number, pageSize: number) => string;
  deleteUser: (id: number) => string;
  editUser: (id: number) => string;
  addUser: string;
}

const endpoints: UserApiEndpoints = {
  currentUser: '/users/current',
  getUsers: (page: number, pageSize: number) => `/users?PageNumber=${page}&PageSize=${pageSize}`,
  deleteUser: (id: number) => `/users/${id}`,
  editUser: (id: number) => `/users/${id}`,
  addUser: '/users',
};

export interface UserApiResponse {
  [key: string]: any;
}

export class UserApi {

  public getCurrentUser(): Promise<UserApiResponse> {
    return ApiService.fetchApi(
      endpoints.currentUser,
      {},
      API_VERBS.GET,
    );
  }

  public updateCurrentUser(user: User): Promise<User> {
    return ApiService.fetchApi(
      endpoints.currentUser,
      user,
      API_VERBS.PUT,
    );
  }

  public getUsers(): Promise<User[]> {
    const urlsArray: string[] = [
      endpoints.getUsers(1, 20),
      endpoints.getUsers(2, 20),
      endpoints.getUsers(3, 20),
      endpoints.getUsers(4, 20),
      endpoints.getUsers(5, 20),
      endpoints.getUsers(6, 20),
      endpoints.getUsers(7, 20),
    ];
    const promises: Promise<any>[] = urlsArray.map((url: string) => ApiService.fetchApi(url));

    return Promise.all(promises)
      .then((data: { items: User[] }[]) => {
        return data
          .map((item: { items: User[] }) => item.items)
          .reduce((a: User[], b: User[]) => a.concat(b));
      });
  }

  public deleteUser(id: number): Promise<{ success: boolean, id: number }> {
    return ApiService.fetchApi(
      endpoints.deleteUser(id),
      {},
      API_VERBS.DELETE,
    )
      .then((result: boolean) => ({
        success: result,
        id: id,
      }));
  }

  public editUser(id: number, user: User): Promise<User> {
    return ApiService.fetchApi(
      endpoints.editUser(id),
      user,
      API_VERBS.PUT,
    );
  }

  public addUser(user: User): Promise<User> {
    return ApiService.fetchApi(
      endpoints.addUser,
      user,
      API_VERBS.POST,
    );
  }

}
