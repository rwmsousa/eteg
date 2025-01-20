import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../entities/client.entity';
import { RegisterClientDto } from './dto/register-client.dto';
import { registerClientSchema } from './dto/register-client.schema';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async registerClient(clientData: RegisterClientDto) {
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
      const existingClientByCpf = await this.clientRepository.findOne({
        where: { cpf: clientData.cpf },
      });
      if (existingClientByCpf) {
        throw new BadRequestException('Client already exists');
      }
      return await this.clientRepository.save(clientData);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error registering client: ' + error.message,
      );
    }
  }

  async listClients() {
    try {
      return await this.clientRepository.find();
    } catch (error) {
      throw new InternalServerErrorException(
        'Error listing clients: ' + error.message,
      );
    }
  }

  async getClient(id: number) {
    try {
      const client = await this.clientRepository.findOne({ where: { id } });
      if (!client) {
        throw new NotFoundException('Client not found');
      }
      return client;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error getting client: ' + error.message,
      );
    }
  }

  async getClientByCpf(cpf: string): Promise<Client | undefined> {
    return await this.clientRepository.findOne({ where: { cpf } });
  }

  async updateClient(
    id: number,
    clientData: RegisterClientDto,
  ): Promise<Client> {
    try {
      const existingClient = await this.clientRepository.findOne({
        where: { id },
      });
      if (!existingClient) {
        throw new NotFoundException('Client not found');
      }

      if (clientData.cpf && clientData.cpf !== existingClient.cpf) {
        const existingClientByCpf = await this.clientRepository.findOne({
          where: { cpf: clientData.cpf },
        });
        if (existingClientByCpf) {
          throw new BadRequestException('CPF already in use');
        }
      }

      const updatedClient = { ...existingClient, ...clientData };
      return await this.clientRepository.save(updatedClient);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error updating client: ' + error.message,
      );
    }
  }

  async deleteClient(id: number): Promise<void> {
    try {
      const result = await this.clientRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException('Client not found');
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error deleting client: ' + error.message,
      );
    }
  }
}
