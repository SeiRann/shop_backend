import { Module } from '@nestjs/common';

import { ClientModule } from './client/client.module';
import { ReviewModule } from './review/review.module';
import { ProductModule } from './product/product.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [ClientModule, ReviewModule, ProductModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
