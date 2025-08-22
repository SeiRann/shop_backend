import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Get,
  Request,
  Res,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { AuthGuard } from './auth.guard';
import express from 'express';
import { Public } from 'src/public-route/public-route.decorator';
import { Admin } from 'src/is-admin/is-admin.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
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
  @Post('admin')
  checkAdmin(@Req() request: express.Request) {
    this.authService.checkAdmin(request);
  }
  //TODO: make it work without public and only with guards
  @Public()
  @Post('logout')
  signOut(@Res({ passthrough: true }) response: express.Response) {
    console.log(response);
    response.clearCookie('jwtCookie', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return response.json({ message: 'Signed out successfully' });
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return req.user;
  }
}
