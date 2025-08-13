import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/signin.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signIn(signIn: SignInDto) {
    const user = await this.prisma.client.findUnique({
      where: {
        email: signIn.email,
      },
    });

    if (user) {
      const passwordCheck = await bcrypt.compare(
        signIn.password,
        user.passwordHash,
      );

      if (passwordCheck) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { passwordHash, ...result } = user;

        return result;
      } else {
        throw new UnauthorizedException();
      }
    } else {
      throw new NotFoundException();
    }
  }

  validateAccessJWT() {}
  refreshAccessJWT() {}
  validateRefreshJWT() {}
  generateJWT() {}
}
