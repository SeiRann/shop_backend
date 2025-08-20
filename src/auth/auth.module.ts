import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.access_secret,
      signOptions: { expiresIn: '10m' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AuthService,
  ],
})
export class AuthModule {}
