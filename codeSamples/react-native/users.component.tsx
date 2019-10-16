import React from 'react';
import {
  View,
  ListRenderItemInfo,
} from 'react-native';
import {
  ThemedComponentProps,
  ThemeType,
  withStyles,
} from '@kitten/theme';
import {
  Input,
  List,
  ListItemProps,
} from '@kitten/ui';
import { User } from '@src/core/model';
import { UserListItem } from '@src/components/user';
import {
  Loading,
  LoadingComponentProps,
} from '@src/components/common';

interface ComponentProps {
  loading: boolean;
  users: User[];
  searchValue: string;
  onSearchValueChange: (text: string) => void;
  onUserPress: (id: number) => void;
  onUserEdit: (id: number) => void;
  onUserDelete: (id: number) => void;
}

export type UsersComponentProps = ThemedComponentProps & ComponentProps;

class UsersComponent extends React.Component<UsersComponentProps> {

  private onUserPress = (id: number): void => {
    this.props.onUserPress(id);
  };

  private onUserEdit = (id: number): void => {
    this.props.onUserEdit(id);
  };

  private onUserDelete = (id: number): void => {
    this.props.onUserDelete(id);
  };

  private onSearchValueChange = (text: string): void => {
    this.props.onSearchValueChange(text);
  };

  private renderUser = (info: ListRenderItemInfo<User>): React.ReactElement<ListItemProps> => {
    return (
      <UserListItem
        user={info.item}
        onUserPress={this.onUserPress}
        onUserEdit={this.onUserEdit}
        onUserDelete={this.onUserDelete}
      />
    );
  };

  private renderLoading = (): React.ReactElement<LoadingComponentProps> => {
    return (
      <Loading/>
    );
  };

  private renderContent = (): React.ReactNode => {
    const { themedStyle, users, searchValue } = this.props;

    return (
      <React.Fragment>
        <Input
          style={themedStyle.searchInput}
          value={searchValue}
          placeholder='Search Users'
          onChangeText={this.onSearchValueChange}
        />
        <List
          style={themedStyle.usersList}
          bounces={false}
          data={users}
          renderItem={this.renderUser}
        />
      </React.Fragment>
    );
  };

  public render(): React.ReactNode {
    const { themedStyle, loading } = this.props;

    return (
      <View style={themedStyle.container}>
        {loading && this.renderLoading()}
        {this.renderContent()}
      </View>
    );
  }
}

export const Users = withStyles(UsersComponent, (theme: ThemeType) => ({
  container: {
    flex: 1,
    backgroundColor: theme['background-basic-color-1'],
  },
  usersList: {
    marginBottom: 30,
  },
  searchInput: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
}));
