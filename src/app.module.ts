import { Module } from '@nestjs/common';

import { ClientModule } from './client/client.module';
import { ReviewModule } from './review/review.module';
import { ProductModule } from './product/product.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ClientModule,
    ReviewModule,
    ProductModule,
    PrismaModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
