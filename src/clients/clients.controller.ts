import { Controller, Get, Post, Body } from '@nestjs/common';
import { ClientsService } from './clients.service';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post('register')
  registerClient(@Body() clientData: any) {
    return this.clientsService.registerClient(clientData);
  }

  @Get('list')
  listClients() {
    return this.clientsService.listClients();
  }
}
