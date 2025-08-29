/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/public-route/public-route.decorator';
import { IS_ADMIN_KEY } from 'src/is-admin/is-admin.decorator';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const isAdmin = this.reflector.getAllAndOverride<boolean>(IS_ADMIN_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest<Request>();

    // pick the correct cookie + secret
    const { cookieName, secret } = isAdmin
      ? {
          cookieName: 'admin_access_token',
          secret: jwtConstants.admin_access_secret,
        }
      : { cookieName: 'access_token', secret: jwtConstants.access_secret };

    if (!request.cookies.jwtCookie) {
      throw new UnauthorizedException(`Cookie ${cookieName} not received`);
    }
    const token = request.cookies.jwtCookie[cookieName];

    if (!token || typeof token !== 'string') {
      throw new UnauthorizedException('Missing or invalid token');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, { secret });
      request['user'] = payload;
    } catch (err) {
      console.log('JWT verify failed:', err);
      throw new UnauthorizedException();
    }

    return true;
  }
}
