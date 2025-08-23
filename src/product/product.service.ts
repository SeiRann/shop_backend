/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

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

  async findOne(id: string) {
    const product = await this.prisma.products.findUnique({
      where: { product_id: id },
    });

    return product;
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
    await this.prisma.products.delete({ where: { product_id: id } });

    return `Product has been deleted`;
  }
}
