import { Test, TestingModule } from '@nestjs/testing';
import { ClientsService } from '../../clients/clients.service';
import { Client } from '../../entities/client.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { RegisterClientDto } from '../../clients/dto/register-client.dto';

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

  it('should be defined', () => {
    expect(clientsService).toBeDefined();
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
      jest.spyOn(clientsRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(clientsRepository, 'save').mockResolvedValue(result);

      expect(await clientsService.registerClient(clientData)).toBe(result);
    });

    it('should throw BadRequestException if client already exists', async () => {
      const clientData: RegisterClientDto & { id: number } = {
        id: 1,
        name: 'John Doe',
        cpf: '12345678901',
        email: 'john@example.com',
        color: 'blue',
        annotations: '',
      };
      jest.spyOn(clientsRepository, 'findOne').mockResolvedValue(clientData);

      await expect(clientsService.registerClient(clientData)).rejects.toThrow(
        BadRequestException,
      );
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

    it('should throw InternalServerErrorException on unexpected error', async () => {
      jest
        .spyOn(clientsRepository, 'find')
        .mockRejectedValue(new Error('Unexpected error'));
      await expect(clientsService.listClients()).rejects.toThrow(
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
      jest.spyOn(clientsRepository, 'findOne').mockResolvedValue(result);

      expect(await clientsService.getClient(1)).toBe(result);
    });

    it('should throw NotFoundException if client not found', async () => {
      jest.spyOn(clientsRepository, 'findOne').mockResolvedValue(null);
      await expect(clientsService.getClient(1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      jest
        .spyOn(clientsRepository, 'findOne')
        .mockRejectedValue(new Error('Unexpected error'));
      await expect(clientsService.getClient(1)).rejects.toThrow(
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
      const existingClient = new Client();
      existingClient.id = 1;
      existingClient.cpf = '12345678901';

      jest.spyOn(clientsRepository, 'findOne').mockImplementation((options) => {
        const where = Array.isArray(options.where)
          ? options.where[0]
          : options.where;
        if (where.id === 1) {
          return Promise.resolve(existingClient);
        }
        return Promise.resolve(null);
      });
      jest.spyOn(clientsRepository, 'save').mockResolvedValue(existingClient);

      expect(await clientsService.updateClient(1, clientData)).toBe(
        existingClient,
      );
    });

    it('should throw NotFoundException if client not found', async () => {
      jest.spyOn(clientsRepository, 'findOne').mockResolvedValue(null);
      const clientData: RegisterClientDto = {
        name: 'John Doe',
        cpf: '12345678901',
        email: 'john@example.com',
        color: 'blue',
        annotations: '',
      };
      await expect(clientsService.updateClient(1, clientData)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      jest
        .spyOn(clientsRepository, 'findOne')
        .mockRejectedValue(new Error('Unexpected error'));
      const clientData: RegisterClientDto = {
        name: 'John Doe',
        cpf: '12345678901',
        email: 'john@example.com',
        color: 'blue',
        annotations: '',
      };
      await expect(clientsService.updateClient(1, clientData)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('deleteClient', () => {
    it('should delete a client', async () => {
      const deleteResult = { affected: 1, raw: {} };
      jest.spyOn(clientsRepository, 'delete').mockResolvedValue(deleteResult);

      expect(await clientsService.deleteClient(1)).toEqual(undefined);
    });

    it('should throw NotFoundException if client not found', async () => {
      jest
        .spyOn(clientsRepository, 'delete')
        .mockResolvedValue({ affected: 0, raw: {} });
      await expect(clientsService.deleteClient(1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      jest
        .spyOn(clientsRepository, 'delete')
        .mockRejectedValue(new Error('Unexpected error'));
      await expect(clientsService.deleteClient(1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
