import { Injectable } from '@nestjs/common';
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
      return await this.clientsRepository.save(clientData);
    } catch (error) {
      throw new Error('Error registering client: ' + error.message);
    }
  }

  async listClients() {
    try {
      return await this.clientsRepository.find();
    } catch (error) {
      throw new Error('Error listing clients: ' + error.message);
    }
  }

  async getClient(id: number) {
    try {
      return await this.clientsRepository.findOne({ where: { id } });
    } catch (error) {
      throw new Error('Error getting client: ' + error.message);
    }
  }

  async updateClient(id: number, clientData: Client) {
    try {
      return await this.clientsRepository.update(id, clientData);
    } catch (error) {
      throw new Error('Error updating client: ' + error.message);
    }
  }

  async deleteClient(id: number) {
    try {
      return await this.clientsRepository.delete(id);
    } catch (error) {
      throw new Error('Error deleting client: ' + error.message);
    }
  }
}
