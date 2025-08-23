import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UploaderModule } from 'src/uploader/uploader.module';
import { UploaderService } from 'src/uploader/uploader.service';

@Module({
  imports: [PrismaModule, UploaderModule],
  controllers: [ProductController],
  providers: [ProductService, UploaderService],
})
export class ProductModule {}
