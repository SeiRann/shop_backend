/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { awsConstants } from 'src/auth/constants';
import { v4 as uuid } from 'uuid';
import { Request } from 'express';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

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
    console.log(file);
    const key = `${uuid()}-${file.originalname}`;
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: awsConstants.aws_bucket ? awsConstants.aws_bucket : '',
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return {
      cdnUrl: `https://${awsConstants.aws_cloudfront_domainname}/${key}`,
    };
  }

  async getSignedUrl(key: string) {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: key,
    });
    return await getSignedUrl(this.s3Client, command, {
      expiresIn: 3600,
    });
  }

  async delete(key: string) {
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET,
        Key: key,
      }),
    );
    return true;
  }
}
