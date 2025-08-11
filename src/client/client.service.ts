import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClientService {
  constructor(private prisma: PrismaService) {}

  async create(createClientDto: CreateClientDto) {
    await this.prisma.client.create({
      data:{
        username:createClientDto.username,
        passwordHash:createClientDto.password,
        email:createClientDto.email,
        phone_number:createClientDto.phone_number,
        address:createClientDto.address
      }
    })

    return `Created ${createClientDto.username} user`
  }

  async findAll() {
    const clients = await this.prisma.client.findMany()

    return clients
  }

  async findOne(id: number) {
    const client = await this.prisma.client.findUnique({where:{client_id:id}})

    return client
  }

  async update(id: number, updateClientDto: UpdateClientDto) {
    await this.prisma.client.update({
      where:{
        client_id: id,
      },
      data:{
        username: updateClientDto.username,
        email:updateClientDto.email,
        passwordHash:updateClientDto.password,
        address:updateClientDto.address,
        phone_number:updateClientDto.phone_number
      }
    })

    return `Updated ${updateClientDto.username} user information`
  }

  async remove(id: number) {
    await this.prisma.client.delete({where:{client_id:id}})

    return `Client deleted`
  }
}
