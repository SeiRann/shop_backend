import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Admin } from 'src/is-admin/is-admin.decorator';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    await this.prisma.orders.create({
      data: {
        ...createOrderDto,
      },
    });
  }

  async findAll() {
    return await this.prisma.orders.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.orders.findUnique({ where: { order_id: id } });
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    return await this.prisma.orders.update({
      where: { order_id: id },
      data: { ...updateOrderDto },
    });
  }

  async remove(id: string) {
    return await this.prisma.orders.delete({ where: { order_id: id } });
  }
}
