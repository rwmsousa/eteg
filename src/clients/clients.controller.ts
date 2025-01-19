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
  ForbiddenException,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { RegisterClientDto } from './dto/register-client.dto';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { registerClientSchema } from './dto/register-client.schema';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('clients')
@Controller('clients')
export class ClientsController {
  private readonly logger = new Logger(ClientsController.name);

  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new client' })
  @ApiBody({ type: RegisterClientDto })
  @ApiResponse({ status: 201, description: 'Client created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async registerClient(@Body() clientData: RegisterClientDto) {
    const { error } = registerClientSchema.validate(clientData);
    if (error) {
      throw new BadRequestException(error.details[0].message);
    }
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
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'Get all clients (admin only)' })
  @ApiResponse({ status: 200, description: 'Clients retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async listClients() {
    try {
      return await this.clientsService.listClients();
    } catch (error) {
      this.logger.error('Error listing clients', error.stack);
      throw new InternalServerErrorException('Error listing clients', error);
    }
  }

  @UseGuards(AuthMiddleware)
  @ApiBearerAuth()
  @Get(':id')
  @ApiOperation({ summary: 'Get a client by ID (admin only)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Client retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Client not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
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
  @ApiBearerAuth()
  @Put(':id')
  @ApiOperation({ summary: 'Update a client by ID (admin only)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: RegisterClientDto })
  @ApiResponse({ status: 200, description: 'Client updated successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Client not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
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
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a client by ID (admin only)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Client deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Client not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async deleteClient(@Param('id') id: number) {
    try {
      await this.clientsService.deleteClient(id);
      return { message: 'Client deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Client not found');
      }
      if (error instanceof ForbiddenException) {
        throw new ForbiddenException('Only admins can delete clients');
      }
      this.logger.error('Error deleting client', error.stack);
      throw new InternalServerErrorException('Error deleting client', error);
    }
  }
}
