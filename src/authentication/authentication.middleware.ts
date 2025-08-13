import { Injectable, NestMiddleware } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

interface AuthenticationRequestInterface {
  body: {
    email: string;
    password: string;
  };
}

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService) {}

  async use(
    req: AuthenticationRequestInterface,
    res: Response,
    next: () => void,
  ) {
    const user = await this.prisma.client.findUnique({
      where: { email: req.body.email },
    });
    let passwordCheck: boolean;
    if (user) {
      passwordCheck = await bcrypt.compare(
        req.body.password,
        user.passwordHash,
      );

      if (passwordCheck) {
        // console.log('successful log in');
        next();
      } else {
        res.status(401).json({
          error: 'Incorrect password',
        });
      }
    } else {
      res.status(404).json({
        error: 'User does not exist',
      });
    }
  }
}
