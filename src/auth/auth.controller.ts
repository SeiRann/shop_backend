import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  Req,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import express from 'express';
import { Admin } from 'src/is-admin/is-admin.decorator';
import { Public } from 'src/public-route/public-route.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('login')
  async signIn(
    @Res({ passthrough: true }) response: express.Response,
    @Body() body: SignInDto,
  ) {
    const token = await this.authService.signIn(body);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    response.cookie('jwtCookie', token, {
      httpOnly: true, // 🔒 prevents JS access
      secure: process.env.NODE_ENV === 'production', // only HTTPS in prod
      sameSite: 'strict', // protects against CSRF
      maxAge: 1000 * 60 * 60 * 24, // 1 day expiration
    });

    return response.json({ message: 'Signed in successfully' });
  }

  @HttpCode(HttpStatus.OK)
  @Admin()
  @Get('admin')
  checkAdmin(@Req() request: express.Request) {
    this.authService.checkAdmin(request);
  }
  //TODO: make it work without public and only with guards
  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('logout')
  signOut(
    @Req() request: express.Request,
    @Res({ passthrough: true }) response: express.Response,
  ) {
    this.authService.signOut(request, response);

    return response.json({ message: 'Signed out successfully' });
  }
}
