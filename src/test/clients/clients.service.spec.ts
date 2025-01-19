import { Test, TestingModule } from '@nestjs/testing';
import { ClientsService } from '../../clients/clients.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Client } from '../../entities/client.entity';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { RegisterClientDto } from '../../clients/dto/register-client.dto';
import { registerClientSchema } from '../../clients/dto/register-client.schema';

describe('ClientsService', () => {
  let service: ClientsService;
  let repository: Repository<Client>;

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

    service = module.get<ClientsService>(ClientsService);
    repository = module.get<Repository<Client>>(getRepositoryToken(Client));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);
      jest.spyOn(repository, 'save').mockResolvedValue(result);

      expect(await service.registerClient(clientData)).toBe(result);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { cpf: clientData.cpf },
      });
      expect(repository.save).toHaveBeenCalledWith(clientData);
    });

    it('should throw BadRequestException if client already exists', async () => {
      const clientData: RegisterClientDto = {
        name: 'John Doe',
        cpf: '12345678901',
        email: 'john@example.com',
        color: 'blue',
        annotations: '',
      };
      jest.spyOn(repository, 'findOne').mockResolvedValue(new Client());

      await expect(service.registerClient(clientData)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if required fields are missing', async () => {
      const clientData: RegisterClientDto = {
        name: '',
        cpf: '',
        email: '',
        color: '',
        annotations: '',
      };
      await expect(service.registerClient(clientData)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if schema validation fails', async () => {
      const clientData: RegisterClientDto = {
        name: 'Jo',
        cpf: '123',
        email: 'invalid-email',
        color: 'bl',
        annotations: '',
      };
      const { error } = registerClientSchema.validate(clientData);
      expect(error).toBeDefined();
      await expect(service.registerClient(clientData)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      const clientData: RegisterClientDto = {
        name: 'John Doe',
        cpf: '12345678901',
        email: 'john@example.com',
        color: 'blue',
        annotations: '',
      };
      jest
        .spyOn(repository, 'save')
        .mockRejectedValue(new Error('Unexpected error'));

      await expect(service.registerClient(clientData)).rejects.toThrow(
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
          annotations: 'Some annotations',
        },
      ];
      jest.spyOn(repository, 'find').mockResolvedValue(result);

      expect(await service.listClients()).toBe(result);
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      jest
        .spyOn(repository, 'find')
        .mockRejectedValue(new Error('Unexpected error'));

      await expect(service.listClients()).rejects.toThrow(
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
        annotations: 'Some annotations',
      };
      jest.spyOn(repository, 'findOne').mockResolvedValue(result);

      expect(await service.getClient(1)).toBe(result);
    });

    it('should throw NotFoundException if client not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.getClient(1)).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      jest
        .spyOn(repository, 'findOne')
        .mockRejectedValue(new Error('Unexpected error'));

      await expect(service.getClient(1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('getClientByCpf', () => {
    it('should return a client by CPF', async () => {
      const result: Client = {
        id: 1,
        name: 'John Doe',
        cpf: '12345678901',
        email: 'john@example.com',
        color: 'blue',
        annotations: 'Some annotations',
      };
      jest.spyOn(repository, 'findOne').mockResolvedValue(result);

      expect(await service.getClientByCpf('12345678901')).toBe(result);
    });

    it('should return undefined if client not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      expect(await service.getClientByCpf('12345678901')).toBeUndefined();
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
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(existingClient);
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(undefined);
      jest.spyOn(repository, 'save').mockResolvedValue(existingClient);

      expect(await service.updateClient(1, clientData)).toBe(existingClient);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(repository.save).toHaveBeenCalledWith({
        ...existingClient,
        ...clientData,
      });
    });

    it('should throw NotFoundException if client not found', async () => {
      const clientData: RegisterClientDto = {
        name: 'John Doe',
        cpf: '12345678901',
        email: 'john@example.com',
        color: 'blue',
        annotations: '',
      };
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.updateClient(1, clientData)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if CPF already in use', async () => {
      const clientData: RegisterClientDto = {
        name: 'John Doe',
        cpf: '12345678901',
        email: 'john@example.com',
        color: 'blue',
        annotations: '',
      };
      const existingClient = new Client();
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(existingClient);
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(new Client());

      await expect(service.updateClient(1, clientData)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      const clientData: RegisterClientDto = {
        name: 'John Doe',
        cpf: '12345678901',
        email: 'john@example.com',
        color: 'blue',
        annotations: '',
      };
      jest
        .spyOn(repository, 'save')
        .mockRejectedValue(new Error('Unexpected error'));

      await expect(service.updateClient(1, clientData)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('deleteClient', () => {
    it('should delete a client', async () => {
      jest
        .spyOn(repository, 'delete')
        .mockResolvedValue({ affected: 1 } as any);

      await expect(service.deleteClient(1)).resolves.toBeUndefined();
      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if client not found', async () => {
      jest
        .spyOn(repository, 'delete')
        .mockResolvedValue({ affected: 0 } as any);

      await expect(service.deleteClient(1)).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      jest
        .spyOn(repository, 'delete')
        .mockRejectedValue(new Error('Unexpected error'));

      await expect(service.deleteClient(1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw ForbiddenException if current user is not admin', async () => {
      jest
        .spyOn(service, 'deleteClient')
        .mockRejectedValue(new ForbiddenException());

      await expect(service.deleteClient(1)).rejects.toThrow(ForbiddenException);
    });
  });
});
