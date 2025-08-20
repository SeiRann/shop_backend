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
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { AuthGuard } from './auth.guard';
import express from 'express';
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

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return req.user;
  }
}
