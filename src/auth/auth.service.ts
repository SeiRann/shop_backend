import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/signin.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

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

      if (passwordCheck) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const payload = {
          sub: client.client_id,
          username: client.username,
        };

        const access_token = await this.jwtService.signAsync(payload);

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
