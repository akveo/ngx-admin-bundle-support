/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Personal / Commercial License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the project root for license information on type of purchased license.
 */

import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Login } from './interfaces/login.dto';
import { Email } from './interfaces/email.dto';
import { ResetPassword } from './interfaces/reset-password.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiUseTags } from '@nestjs/swagger';
import { SignUp } from './interfaces/signUp.dto';

@ApiUseTags('api/auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(AuthGuard('local'))
  public async login(@Body() login: Login, @Req() req) {
    return await this.authService.signIn(req.user);
  }

  @Post('sign-up')
  async signUp(@Body() userDto: SignUp) {
    return await this.authService.signUp(userDto);
  }

  @Post('reset-pass')
  async resetPass(@Body() resetPass: ResetPassword, @Res() res) {
    return await this.authService.resetPassword(resetPass)
      .then(() => res.status(200).send({ message: 'ok' }));
  }

  @Post('request-pass')
  async requestPass(@Body() email: Email, @Res() res) {
    return await this.authService.requestPassword(email.email)
      .then(() => res.status(200).send({ message: `Email with reset password instructions was sent to email ${email.email}.` }));

  }

  @Post('sign-out')
  async signOut(@Body() email: Email, @Res() res) {
    res.status(200).send({ message: 'ok' });
  }

}
