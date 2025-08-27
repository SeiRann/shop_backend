/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { awsConstants } from 'src/auth/constants';
import { UploaderService } from 'src/uploader/uploader.service';
import { validate as isUuid } from 'uuid';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private uploader: UploaderService,
  ) {}

  async create(createProductDto: CreateProductDto, url: string) {
    // Parse sizes safely
    const sizes = JSON.parse(createProductDto.sizes);

    await this.prisma.products.create({
      data: {
        image: url,
        title: createProductDto.title,
        description: createProductDto.description,
        sizes: sizes,
        stock: Number(createProductDto.stock),
      },
    });

    return `The product ${createProductDto.title} has been created`;
  }

  async findAll() {
    const products = await this.prisma.products.findMany();

    return products;
  }

  async findMany(page: number) {
    const productsPerPage = 20;
    const skip = (page - 1) * productsPerPage;

    const products = await this.prisma.products.findMany({
      skip: skip,
      take: productsPerPage,
    });

    return products;
  }

  async findOne(id: string) {
    if (isUuid(id)) {
      const product = await this.prisma.products.findUnique({
        where: { product_id: id },
      });

      return product;
    } else {
      throw new BadRequestException();
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto, url?: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    if (updateProductDto.sizes) {
      const sizes: string[] = JSON.parse(updateProductDto.sizes);

      await this.prisma.products.update({
        where: {
          product_id: id,
        },
        data: {
          image: url,
          title: updateProductDto.title,
          description: updateProductDto.description,
          sizes: sizes,
          stock: Number(updateProductDto.stock),
        },
      });
    } else {
      await this.prisma.products.update({
        where: {
          product_id: id,
        },
        data: {
          image: url,
          title: updateProductDto.title,
          description: updateProductDto.description,
          stock: updateProductDto.stock,
        },
      });
    }

    return `Product ${updateProductDto.title} has been updated`;
  }

  async remove(id: string) {
    const product = await this.prisma.products.findUnique({
      where: {
        product_id: id,
      },
    });

    if (product) {
      const imageURL = product?.image;
      const extractedKey = imageURL?.replace(
        `https://${awsConstants.aws_cloudfront_domainname}/`,
        '',
      );

      await this.uploader.delete(extractedKey);

      await this.prisma.products.delete({ where: { product_id: id } });

      return `Product has been deleted`;
    }
  }
}
