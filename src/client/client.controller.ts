import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Public } from 'src/public-route/public-route.decorator';
import { Admin } from 'src/is-admin/is-admin.decorator';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Public()
  @Post()
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientService.create(createClientDto);
  }

  @Admin()
  findAll() {
    return this.clientService.findAll();
  }

  @Admin()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientService.findOne(id);
  }

  @Admin()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientService.update(id, updateClientDto);
  }

  @Admin()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientService.remove(id);
  }
}
