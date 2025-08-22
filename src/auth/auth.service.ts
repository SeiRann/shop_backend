import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/signin.dto';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Request, Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  checkAdmin(req: Request) {
    console.log('Is admin!');
    console.log(req.cookies);
  }

  signOut(req: Request, res: Response) {
    if (req.cookies.jwtCookie) {
      console.log(req.cookies);
      res.clearCookie('jwtCookie', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
    } else {
      console.log("doesn't have cookies");
      throw new UnauthorizedException('Missing cookies');
    }
  }

  async signIn(signIn: SignInDto) {
    const client = await this.prisma.client.findUnique({
      where: {
        email: signIn.email,
      },
    });

    if (client) {
      const passwordCheck = await bcrypt.compare(
        signIn.password,
        client.passwordHash,
      );

      if (passwordCheck && client.isAdmin) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const payload = {
          sub: client.client_id,
          username: client.username,
        };

        const access_token = await this.jwtService.signAsync(payload, {
          secret: jwtConstants.admin_access_secret,
        });
        console.log('admin logged in');
        return {
          admin_access_token: access_token,
        };
      } else if (passwordCheck) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const payload = {
          sub: client.client_id,
          username: client.username,
        };

        const access_token = await this.jwtService.signAsync(payload);
        console.log('regular user logged in');
        return {
          access_token: access_token,
        };
      } else {
        throw new UnauthorizedException();
      }
    } else {
      throw new NotFoundException();
    }
  }
}
