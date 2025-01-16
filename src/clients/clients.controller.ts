import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { Client } from '../entities/client.entity';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  registerClient(@Body() clientData: Client) {
    if (!clientData.cpf || !clientData.name || !clientData.email) {
      throw new BadRequestException(
        'Missing required fields: cpf, name, email',
      );
    }
    return this.clientsService.registerClient(clientData);
  }

  @Get()
  listClients() {
    return this.clientsService.listClients();
  }

  @Get(':id')
  getClient(@Param('id') id: number) {
    return this.clientsService.getClient(id);
  }

  @Put(':id')
  updateClient(@Param('id') id: number, @Body() clientData: Client) {
    return this.clientsService.updateClient(id, clientData);
  }

  @Delete(':id')
  deleteClient(@Param('id') id: number) {
    return this.clientsService.deleteClient(id);
  }
}
