import React from 'react';
import { Alert } from 'react-native';
import { connect } from 'react-redux';
import {
  NavigationScreenConfig,
  NavigationScreenProps,
} from 'react-navigation';
import { Users } from './users.component';
import { User } from '@src/core/model';
import { GlobalState } from '@src/store';
import {
  setUsers,
  setUsersFilterCriteria,
  setUserSearchString,
  deleteUser,
  setUser,
} from '../../actions';
import { UserService } from '../../service';
import { getFilteredUsers } from '../../selectors';
import {
  UserListHeader,
  UserListHeaderProps,
} from '@src/components/user';
import { TopNavigationElement } from '@src/core/navigation/options';
import { newUserShell } from './newUser.shell';

interface StateProps {
  users: User[];
  searchString: string;
  setUsers: (users: User[]) => void;
  setUsersSearchString: (value: string) => void;
  setUsersFilterCriteria: (criteria: string) => void;
  deleteUser: (id: number) => void;
  setUser: (user: User) => void;
}

interface State {
  loading: boolean;
}

const mapStateToProps = (state: GlobalState) => ({
  users: getFilteredUsers(state),
  searchString: state.searchUsers.searchString,
});

const mapDispatchToProps = (dispatch: Function) => ({
  setUsers: (users: User[]) => dispatch(setUsers(users)),
  setUsersSearchString: (value: string) => dispatch(setUserSearchString(value)),
  setUsersFilterCriteria: (criteria: string) => dispatch(setUsersFilterCriteria(criteria)),
  deleteUser: (id: number) => dispatch(deleteUser(id)),
  setUser: (user: User) => dispatch(setUser(user)),
});

type ComponentProps = NavigationScreenProps & StateProps;

@connect(mapStateToProps, mapDispatchToProps)
export class UsersContainer extends React.Component<ComponentProps, State> {

  static navigationOptions: NavigationScreenConfig<any> = ({ navigation, screenProps }) => {
    const usersHeaderConfig: UserListHeaderProps = {
      onBack: navigation.getParam('onBack'),
      onMenuItemPress: navigation.getParam('onMenuItemPress'),
      onAddUser: navigation.getParam('onAddUser'),
      ...navigation,
    };

    const renderHeader = (headerProps: NavigationScreenProps) => {
      return (
        <UserListHeader
          {...headerProps}
          {...usersHeaderConfig}
        />
      );
    };

    return {
      ...navigation,
      ...screenProps,
      header: (headerProps: NavigationScreenProps): TopNavigationElement => {
        return renderHeader(headerProps);
      },
    };
  };

  public state: State = {
    loading: false,
  };

  private service: UserService = new UserService();
  private getUsersFailureMessage: string = 'Something went wrong while getting users.';
  private deleteUserFailureMessage: string = 'Something went wrong while delete user.';
  private navigationKey: string = 'UsersContainer';

  private setLoading = (loading: boolean): void => {
    this.setState({ loading });
  };

  public componentWillMount(): void {
    this.setNavigationParams();
    if (!this.props.users.length) {
      this.setUsers();
    }
  }

  private setUsers = (): void => {
    this.setLoading(true);
    this.service.getUsers()
      .then(this.getUsersSuccess)
      .catch(this.getUsersFailure);
  };

  private setNavigationParams = (): void => {
    this.props.navigation.setParams({
      onBack: this.onBackPress,
      onMenuItemPress: this.onSearchOptionSelect,
      onAddUser: this.onAddUser,
    });
  };

  private onBackPress = (): void => {
    this.props.navigation.goBack(null);
  };

  private onSearchOptionSelect = (option: string): void => {
    this.props.setUsersFilterCriteria(option);
  };

  private onAddUser = (): void => {
    this.props.setUser(newUserShell);
    this.props.navigation.navigate({
      key: this.navigationKey,
      routeName: 'Edit User',
      params: {
        title: 'New',
      },
    });
  };

  private onUserDelete = (id: number): void => {
    this.setLoading(true);
    this.service.deleteUser(id)
      .then(this.onDeleteUserSuccess)
      .catch(this.onDeleteUserError);
  };

  private onDeleteUserSuccess = (result: { success: boolean, id: number }): void => {
    this.props.deleteUser(result.id);
    this.setLoading(false);
  };

  private onDeleteUserError = (): void => {
    this.setLoading(false);
    Alert.alert(this.deleteUserFailureMessage);
  };

  private getUsersSuccess = (users: User[]): void => {
    this.setLoading(false);
    this.props.setUsers(users);
  };

  private getUsersFailure = (): void => {
    this.setLoading(false);
    Alert.alert(this.getUsersFailureMessage);
  };

  private onUserPress = (id: number): void => {

  };

  private onUserEdit = (id: number): void => {
    const userForEdit: User = this.props.users
      .find((user: User) => user.id === id);

    this.props.setUser(userForEdit);
    this.props.navigation.navigate({
      key: this.navigationKey,
      routeName: 'Edit User',
      params: {
        title: 'Edit',
      },
    });
  };

  private onSearchValueChange = (searchValue: string): void => {
    this.props.setUsersSearchString(searchValue);
  };

  render(): React.ReactNode {
    const { loading } = this.state;
    const { users, searchString } = this.props;

    return (
      <Users
        loading={loading}
        users={users}
        searchValue={searchString}
        onSearchValueChange={this.onSearchValueChange}
        onUserPress={this.onUserPress}
        onUserDelete={this.onUserDelete}
        onUserEdit={this.onUserEdit}
      />
    );
  }
}
