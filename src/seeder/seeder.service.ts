import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Client } from '../entities/client.entity';

@Injectable()
export default class SeederService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async seed() {
    await this.seedUsers();
    await this.seedClients();
  }

  private async seedUsers() {
    const users = [
      { username: 'user1', password: 'password1', email: 'user1@example.com' },
      { username: 'user2', password: 'password2', email: 'user2@example.com' },
      { username: 'user3', password: 'password3', email: 'user3@example.com' },
    ];

    for (const user of users) {
      const existingUser = await this.userRepository.findOne({
        where: { email: user.email },
      });
      if (!existingUser) {
        await this.userRepository.save(user);
      }
    }
  }

  private async seedClients() {
    const clients = [
      {
        name: 'client1',
        cpf: '11111111111',
        email: 'client1@example.com',
        color: 'red',
        annotations: 'annotation1',
      },
      {
        name: 'client2',
        cpf: '22222222222',
        email: 'client2@example.com',
        color: 'green',
        annotations: 'annotation2',
      },
      {
        name: 'client3',
        cpf: '33333333333',
        email: 'client3@example.com',
        color: 'blue',
        annotations: 'annotation3',
      },
    ];

    for (const client of clients) {
      const existingClient = await this.clientRepository.findOne({
        where: { cpf: client.cpf },
      });
      if (!existingClient) {
        await this.clientRepository.save(client);
      }
    }
  }
}
