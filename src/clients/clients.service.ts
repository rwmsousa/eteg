import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../entities/client.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
  ) {}

  async registerClient(clientData: Client) {
    try {
      const existingClientByCpf = await this.clientsRepository.findOne({
        where: { cpf: clientData.cpf },
      });
      if (existingClientByCpf) {
        throw new BadRequestException('Client already exists');
      }
      return await this.clientsRepository.save(clientData);
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
      return await this.clientsRepository.find();
    } catch (error) {
      throw new InternalServerErrorException(
        'Error listing clients: ' + error.message,
      );
    }
  }

  async getClient(id: number) {
    try {
      return await this.clientsRepository.findOne({ where: { id } });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error getting client: ' + error.message,
      );
    }
  }

  async updateClient(id: number, clientData: Client) {
    try {
      return await this.clientsRepository.update(id, clientData);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error updating client: ' + error.message,
      );
    }
  }

  async deleteClient(id: number) {
    try {
      return await this.clientsRepository.delete(id);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error deleting client: ' + error.message,
      );
    }
  }
}
