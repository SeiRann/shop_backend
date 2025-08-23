/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { UpdateUploaderDto } from './dto/update-uploader.dto';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { awsConstants } from 'src/auth/constants';
import { v4 as uuid } from 'uuid';
import { Request } from 'express';

@Injectable()
export class UploaderService {
  private s3Client = new S3Client({
    region: awsConstants.aws_region ? awsConstants.aws_region : '',
    credentials: {
      accessKeyId: awsConstants.aws_access_key
        ? awsConstants.aws_access_key
        : '',
      secretAccessKey: awsConstants.aws_secret_access_key
        ? awsConstants.aws_secret_access_key
        : '',
    },
  });

  async upload(file: Express.Multer.File) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const key = `${uuid()}-${file.originalname}`;
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: awsConstants.aws_bucket ? awsConstants.aws_bucket : '',
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return `https://${awsConstants.aws_cloudfront_domainname}/${key}`;
  }

  findAll() {
    return `This action returns all uploader`;
  }

  findOne(id: number) {
    return `This action returns a #${id} uploader`;
  }

  remove(id: number) {
    return `This action removes a #${id} uploader`;
  }
}
