import { Test, TestingModule } from '@nestjs/testing';
import { ClientsController } from '../../src/clients/clients.controller';
import { ClientsService } from '../../src/clients/clients.service';
import { Client } from '../../src/entities/client.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('ClientsController', () => {
  let clientsController: ClientsController;
  let clientsService: ClientsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientsController],
      providers: [
        ClientsService,
        {
          provide: getRepositoryToken(Client),
          useClass: Repository,
        },
      ],
    }).compile();

    clientsController = module.get<ClientsController>(ClientsController);
    clientsService = module.get<ClientsService>(ClientsService);
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
      jest
        .spyOn(clientsService, 'registerClient')
        .mockResolvedValue(clientData);

      expect(await clientsController.registerClient(clientData)).toBe(
        clientData,
      );
    });

    it('should throw BadRequestException if required fields are missing', async () => {
      const clientData: Partial<Client> = {
        name: 'John Doe',
        email: 'john@example.com',
      };

      await expect(
        clientsController.registerClient(clientData as Client),
      ).rejects.toThrow(BadRequestException);
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
        .spyOn(clientsService, 'registerClient')
        .mockRejectedValue(new Error('Database error'));

      await expect(
        clientsController.registerClient(clientData),
      ).rejects.toThrow(InternalServerErrorException);
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
      jest.spyOn(clientsService, 'listClients').mockResolvedValue(result);

      expect(await clientsController.listClients()).toBe(result);
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
      jest.spyOn(clientsService, 'getClient').mockResolvedValue(result);

      expect(await clientsController.getClient(1)).toBe(result);
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
      jest
        .spyOn(clientsService, 'updateClient')
        .mockResolvedValue(updateResult);

      expect(await clientsController.updateClient(1, clientData)).toEqual(
        updateResult,
      );
    });
  });

  describe('deleteClient', () => {
    it('should delete a client', async () => {
      const deleteResult = { affected: 1, raw: {} };
      jest
        .spyOn(clientsService, 'deleteClient')
        .mockResolvedValue(deleteResult);

      expect(await clientsController.deleteClient(1)).toEqual(deleteResult);
    });
  });
});
