/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Personal / Commercial License.
 * See LICENSE_PERSONAL / LICENSE_COMMERCIAL in the project root for license information on type of purchased license.
 */

import { NgModule } from '@angular/core';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { ThemeModule } from '../../@theme/theme.module';
import { UsersRoutingModule } from './users-routing.module';
import { AuthModule } from '../../@auth/auth.module';

// components
import { UsersComponent } from './users.component';
import { UserComponent } from './user/user.component';
import { UsersTableComponent } from './users-table/users-table.component';
// components


@NgModule({
  imports: [
    ThemeModule,
    AuthModule,
    Ng2SmartTableModule,
    UsersRoutingModule,
  ],
  declarations: [
    UsersComponent,
    UsersTableComponent,
    UserComponent,
  ],
  entryComponents: [
  ],
  providers: [],
})
export class UsersModule { }
