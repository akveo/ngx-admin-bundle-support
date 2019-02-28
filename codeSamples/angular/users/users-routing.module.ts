/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Personal / Commercial License.
 * See LICENSE_PERSONAL / LICENSE_COMMERCIAL in the project root for license information on type of purchased license.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsersComponent } from './users.component';
import { UserComponent } from './user/user.component';
import { UsersTableComponent } from './users-table/users-table.component';

const routes: Routes = [{
  path: '',
  component: UsersComponent,
  children: [
    {
      path: '',
      component: UsersTableComponent,
    },
    {
      path: 'edit/:id',
      component: UserComponent,
    },
    {
      path: 'add',
      component: UserComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {

}
