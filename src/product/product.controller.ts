import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Admin } from 'src/is-admin/is-admin.decorator';
import { UploaderService } from 'src/uploader/uploader.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly uploaderService: UploaderService,
  ) {}

  @Admin()
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: typeof createProductDto.file,
  ) {
    const url = await this.uploaderService.upload(file);
    return this.productService.create(createProductDto, url.cdnUrl);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() file?: typeof updateProductDto.file,
  ) {
    if (file) {
      const url = await this.uploaderService.upload(file);
      return this.productService.update(id, updateProductDto, url.cdnUrl);
    } else {
      return this.productService.update(id, updateProductDto);
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
