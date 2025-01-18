import { Test, TestingModule } from '@nestjs/testing';
import { ClientsController } from '../../clients/clients.controller';
import { ClientsService } from '../../clients/clients.service';
import { Client } from '../../entities/client.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { RegisterClientDto } from '../../clients/dto/register-client.dto';

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

  it('should be defined', () => {
    expect(clientsController).toBeDefined();
  });

  describe('registerClient', () => {
    it('should register a client with valid data', async () => {
      const clientData: RegisterClientDto = {
        name: 'John Doe',
        cpf: '12345678901',
        email: 'john@example.com',
        color: 'blue',
        annotations: '',
      };
      const result = new Client();
      jest.spyOn(clientsService, 'registerClient').mockResolvedValue(result);

      expect(await clientsController.registerClient(clientData)).toBe(result);
    });

    it('should throw BadRequestException if required fields are missing', async () => {
      const clientData: Partial<RegisterClientDto> = {
        name: 'John Doe',
        email: 'john@example.com',
      };

      await expect(
        clientsController.registerClient(clientData as RegisterClientDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw InternalServerErrorException if there is a database error', async () => {
      const clientData: RegisterClientDto = {
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

    it('should throw InternalServerErrorException on unexpected error', async () => {
      jest
        .spyOn(clientsService, 'listClients')
        .mockRejectedValue(new Error('Unexpected error'));
      await expect(clientsController.listClients()).rejects.toThrow(
        InternalServerErrorException,
      );
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

    it('should throw NotFoundException if client not found', async () => {
      jest.spyOn(clientsService, 'getClient').mockResolvedValue(null);
      await expect(clientsController.getClient(1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      jest
        .spyOn(clientsService, 'getClient')
        .mockRejectedValue(new Error('Unexpected error'));
      await expect(clientsController.getClient(1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('updateClient', () => {
    it('should update a client', async () => {
      const clientData: RegisterClientDto = {
        name: 'John Doe',
        cpf: '12345678901',
        email: 'john@example.com',
        color: 'blue',
        annotations: '',
      };
      const result = new Client();
      jest.spyOn(clientsService, 'updateClient').mockResolvedValue(result);

      expect(await clientsController.updateClient(1, clientData)).toBe(result);
    });

    it('should throw NotFoundException if client not found', async () => {
      jest
        .spyOn(clientsService, 'updateClient')
        .mockRejectedValue(new NotFoundException());
      const clientData: RegisterClientDto = {
        name: 'John Doe',
        cpf: '12345678901',
        email: 'john@example.com',
        color: 'blue',
        annotations: '',
      };
      await expect(
        clientsController.updateClient(1, clientData),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      jest
        .spyOn(clientsService, 'updateClient')
        .mockRejectedValue(new Error('Unexpected error'));
      const clientData: RegisterClientDto = {
        name: 'John Doe',
        cpf: '12345678901',
        email: 'john@example.com',
        color: 'blue',
        annotations: '',
      };
      await expect(
        clientsController.updateClient(1, clientData),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('deleteClient', () => {
    it('should delete a client', async () => {
      jest.spyOn(clientsService, 'deleteClient').mockResolvedValue(undefined);

      expect(await clientsController.deleteClient(1)).toEqual({
        message: 'Client deleted successfully',
      });
    });

    it('should throw NotFoundException if client not found', async () => {
      jest
        .spyOn(clientsService, 'deleteClient')
        .mockRejectedValue(new NotFoundException());
      await expect(clientsController.deleteClient(1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      jest
        .spyOn(clientsService, 'deleteClient')
        .mockRejectedValue(new Error('Unexpected error'));
      await expect(clientsController.deleteClient(1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
