import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { RegisterClientDto } from './dto/register-client.dto';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  async registerClient(@Body() clientData: RegisterClientDto) {
    if (!clientData.cpf || !clientData.name || !clientData.email) {
      throw new BadRequestException(
        'Missing required fields: cpf, name, email',
      );
    }
    try {
      return await this.clientsService.registerClient(clientData);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error registering client', error);
    }
  }

  @Get()
  async listClients() {
    try {
      return await this.clientsService.listClients();
    } catch (error) {
      throw new InternalServerErrorException('Error listing clients', error);
    }
  }

  @Get(':id')
  async getClient(@Param('id') id: number) {
    try {
      const client = await this.clientsService.getClient(id);
      if (!client) {
        throw new NotFoundException('Client not found');
      }
      return client;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Client not found');
      }
      throw new InternalServerErrorException('Error getting client', error);
    }
  }

  @Put(':id')
  async updateClient(
    @Param('id') id: number,
    @Body() clientData: RegisterClientDto,
  ) {
    try {
      return await this.clientsService.updateClient(id, clientData);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Client not found');
      }
      if (error instanceof BadRequestException) {
        throw new BadRequestException('CPF already in use');
      }
      throw new InternalServerErrorException('Error updating client', error);
    }
  }

  @Delete(':id')
  async deleteClient(@Param('id') id: number) {
    try {
      await this.clientsService.deleteClient(id);
      return { message: 'Client deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Client not found');
      }
      throw new InternalServerErrorException('Error deleting client', error);
    }
  }
}
