import { Test, TestingModule } from '@nestjs/testing';
import { ClientsService } from '../../src/clients/clients.service';
import { Client } from '../../src/entities/client.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';

describe('ClientsService', () => {
  let clientsService: ClientsService;
  let clientsRepository: Repository<Client>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        {
          provide: getRepositoryToken(Client),
          useClass: Repository,
        },
      ],
    }).compile();

    clientsService = module.get<ClientsService>(ClientsService);
    clientsRepository = module.get<Repository<Client>>(
      getRepositoryToken(Client),
    );
  });

  describe('registerClient', () => {
    it('should register a client with valid data', async () => {
      const clientData: Client = {
        id: 1,
        name: 'John Doe',
        cpf: '12345678901',
        email: 'john@example.com',
        color: 'blue',
        annotations: '',
      };
      jest.spyOn(clientsRepository, 'save').mockResolvedValue(clientData);

      expect(await clientsService.registerClient(clientData)).toBe(clientData);
    });

    it('should throw InternalServerErrorException if there is a database error', async () => {
      const clientData: Client = {
        id: 1,
        name: 'John Doe',
        cpf: '12345678901',
        email: 'john@example.com',
        color: 'blue',
        annotations: '',
      };
      jest
        .spyOn(clientsRepository, 'save')
        .mockRejectedValue(new Error('Database error'));

      await expect(clientsService.registerClient(clientData)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('listClients', () => {
    it('should return an array of clients', async () => {
      const result: Client[] = [
        {
          id: 1,
          name: 'John Doe',
          cpf: '12345678901',
          email: 'john@example.com',
          color: 'blue',
          annotations: '',
        },
      ];
      jest.spyOn(clientsRepository, 'find').mockResolvedValue(result);

      expect(await clientsService.listClients()).toBe(result);
    });
  });

  describe('getClient', () => {
    it('should return a client', async () => {
      const result: Client = {
        id: 1,
        name: 'John Doe',
        cpf: '12345678901',
        email: 'john@example.com',
        color: 'blue',
        annotations: '',
      };
      jest.spyOn(clientsRepository, 'findOne').mockResolvedValue(result);

      expect(await clientsService.getClient(1)).toBe(result);
    });
  });

  describe('updateClient', () => {
    it('should update a client', async () => {
      const clientData: Client = {
        id: 1,
        name: 'John Doe',
        cpf: '12345678901',
        email: 'john@example.com',
        color: 'blue',
        annotations: '',
      };
      const updateResult = { affected: 1, raw: {}, generatedMaps: [] };
      jest.spyOn(clientsRepository, 'update').mockResolvedValue(updateResult);

      expect(await clientsService.updateClient(1, clientData)).toEqual(
        updateResult,
      );
    });
  });

  describe('deleteClient', () => {
    it('should delete a client', async () => {
      const deleteResult = { affected: 1, raw: {} };
      jest.spyOn(clientsRepository, 'delete').mockResolvedValue(deleteResult);

      expect(await clientsService.deleteClient(1)).toEqual(deleteResult);
    });
  });
});
