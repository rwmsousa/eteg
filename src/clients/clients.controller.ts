import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { RegisterClientDto } from './dto/register-client.dto';
import { AuthMiddleware } from '../middleware/auth.middleware';

@Controller('clients')
export class ClientsController {
  private readonly logger = new Logger(ClientsController.name);

  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  async registerClient(@Body() clientData: RegisterClientDto) {
    if (!clientData.cpf || !clientData.name || !clientData.email) {
      throw new BadRequestException(
        'Missing required fields: cpf, name, email',
      );
    }
    try {
      const existingClient = await this.clientsService.getClientByCpf(
        clientData.cpf,
      );
      if (existingClient) {
        throw new BadRequestException('CPF already in use');
      }
      return await this.clientsService.registerClient(clientData);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error('Error registering client', error.stack);
      throw new InternalServerErrorException(
        'Error registering client: ' + error.message,
        error,
      );
    }
  }

  @UseGuards(AuthMiddleware)
  @Get()
  async listClients() {
    try {
      return await this.clientsService.listClients();
    } catch (error) {
      this.logger.error('Error listing clients', error.stack);
      throw new InternalServerErrorException('Error listing clients', error);
    }
  }

  @UseGuards(AuthMiddleware)
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
      this.logger.error('Error getting client', error.stack);
      throw new InternalServerErrorException('Error getting client', error);
    }
  }

  @UseGuards(AuthMiddleware)
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
      this.logger.error('Error updating client', error.stack);
      throw new InternalServerErrorException('Error updating client', error);
    }
  }

  @UseGuards(AuthMiddleware)
  @Delete(':id')
  async deleteClient(@Param('id') id: number) {
    try {
      await this.clientsService.deleteClient(id);
      return { message: 'Client deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Client not found');
      }
      this.logger.error('Error deleting client', error.stack);
      throw new InternalServerErrorException('Error deleting client', error);
    }
  }
}
