import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    await this.prisma.products.create({
      data:{
        image:createProductDto.image,
        title:createProductDto.title,
        description:createProductDto.description,
        sizes:createProductDto.sizes,
        stock:createProductDto.stock,
      }
    })

    return `The product ${createProductDto.title} has been created`
  }

  async findAll() {
    const products = await this.prisma.products.findMany();

    return products
  }

  async findOne(id: number) {
    const product = await this.prisma.products.findUnique({where:{product_id: id}})

    return product
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.prisma.products.update({
      where:{
        product_id: id
      },
      data:{
        image:updateProductDto.image,
        title:updateProductDto.title,
        description:updateProductDto.description,
        sizes:updateProductDto.sizes,
        stock:updateProductDto.stock,
      }
    })

    return `Product ${updateProductDto.title} has been updated`
  }

  async remove(id: number) {
    await this.prisma.products.delete({where:{product_id:id}})

    return `Product has been deleted`
  }
}
