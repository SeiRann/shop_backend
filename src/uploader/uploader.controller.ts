import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UploaderService } from './uploader.service';

import { Admin } from 'src/is-admin/is-admin.decorator';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import {} from '@nestjs/common';
@Controller('uploader')
export class UploaderController {
  constructor(private readonly uploaderService: UploaderService) {}

  @Admin()
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(@UploadedFile() file: Express.Multer.File) {
    const url = await this.uploaderService.upload(file);
    return url;
  }

  @Admin()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.uploaderService.getSignedUrl(id);
  }

  @Admin()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.uploaderService.delete(id);
  }
}
