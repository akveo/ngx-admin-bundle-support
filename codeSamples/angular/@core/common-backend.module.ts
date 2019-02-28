/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Personal / Commercial License.
 * See LICENSE_PERSONAL / LICENSE_COMMERCIAL in the project root for license information on type of purchased license.
 */

import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserData } from '../../interfaces/common/users';
import { UsersService } from './services/users.service';
import { UsersApi } from './api/users.api';
import { HttpService } from './api/http.service';
import { CountryData } from '../../interfaces/common/countries';
import { CountriesService } from './services/countries.service';
import { CountriesApi } from './api/countries.api';

const API = [UsersApi, CountriesApi, HttpService];

const SERVICES = [
  { provide: UserData, useClass: UsersService },
  { provide: CountryData, useClass: CountriesService },
];

@NgModule({
  imports: [CommonModule],
})
export class CommonBackendModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: CommonBackendModule,
      providers: [
        ...API,
        ...SERVICES,
      ],
    };
  }
}
