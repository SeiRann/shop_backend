import { Module } from '@nestjs/common';

import { ClientModule } from './client/client.module';
import { ReviewModule } from './review/review.module';
import { ProductModule } from './product/product.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/constants';
import { AuthGuard } from './auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ClientModule,
    ReviewModule,
    ProductModule,
    PrismaModule,
    AuthModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.access_secret,
      signOptions: { expiresIn: '10m' },
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
