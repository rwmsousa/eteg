import { Test, TestingModule } from '@nestjs/testing';
import { ClientsController } from '../../clients/clients.controller';
import { ClientsService } from '../../clients/clients.service';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Client } from '../../entities/client.entity';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { RegisterClientDto } from '../../clients/dto/register-client.dto';
import { UserModule } from '../../user/user.module';
import { registerClientSchema } from '../../clients/dto/register-client.schema';

describe('ClientsController', () => {
  let controller: ClientsController;
  let service: ClientsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UserModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Client],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Client]),
      ],
      controllers: [ClientsController],
      providers: [
        ClientsService,
        {
          provide: getRepositoryToken(Client),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<ClientsController>(ClientsController);
    service = module.get<ClientsService>(ClientsService);

    // Mock the logger
    jest.spyOn(controller['logger'], 'error').mockImplementation(() => {});
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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
      jest.spyOn(service, 'getClientByCpf').mockResolvedValue(undefined);
      jest.spyOn(service, 'registerClient').mockResolvedValue(result);

      expect(await controller.registerClient(clientData)).toBe(result);
      expect(service.getClientByCpf).toHaveBeenCalledWith(clientData.cpf);
      expect(service.registerClient).toHaveBeenCalledWith(clientData);
    });

    it('should throw BadRequestException if required fields are missing', async () => {
      const clientData: Partial<RegisterClientDto> = {
        name: 'John Doe',
        email: 'john@example.com',
      };

      await expect(
        controller.registerClient(clientData as RegisterClientDto),
      ).rejects.toThrow(BadRequestException);
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
      await expect(controller.registerClient(clientData)).rejects.toThrow(
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
        .spyOn(service, 'registerClient')
        .mockRejectedValue(new Error('Database error'));

      await expect(controller.registerClient(clientData)).rejects.toThrow(
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
      jest.spyOn(service, 'listClients').mockResolvedValue(result);

      expect(await controller.listClients()).toBe(result);
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      jest
        .spyOn(service, 'listClients')
        .mockRejectedValue(new Error('Unexpected error'));
      await expect(controller.listClients()).rejects.toThrow(
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
      jest.spyOn(service, 'getClient').mockResolvedValue(result);

      expect(await controller.getClient(1)).toBe(result);
    });

    it('should throw NotFoundException if client not found', async () => {
      jest.spyOn(service, 'getClient').mockResolvedValue(null);
      await expect(controller.getClient(1)).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      jest
        .spyOn(service, 'getClient')
        .mockRejectedValue(new Error('Unexpected error'));
      await expect(controller.getClient(1)).rejects.toThrow(
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
      jest.spyOn(service, 'updateClient').mockResolvedValue(result);

      expect(await controller.updateClient(1, clientData)).toBe(result);
    });

    it('should throw NotFoundException if client not found', async () => {
      jest
        .spyOn(service, 'updateClient')
        .mockRejectedValue(new NotFoundException());
      const clientData: RegisterClientDto = {
        name: 'John Doe',
        cpf: '12345678901',
        email: 'john@example.com',
        color: 'blue',
        annotations: '',
      };
      await expect(controller.updateClient(1, clientData)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      jest
        .spyOn(service, 'updateClient')
        .mockRejectedValue(new Error('Unexpected error'));
      const clientData: RegisterClientDto = {
        name: 'John Doe',
        cpf: '12345678901',
        email: 'john@example.com',
        color: 'blue',
        annotations: '',
      };
      await expect(controller.updateClient(1, clientData)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('deleteClient', () => {
    it('should delete a client', async () => {
      jest.spyOn(service, 'deleteClient').mockResolvedValue(undefined);

      expect(await controller.deleteClient(1)).toEqual({
        message: 'Client deleted successfully',
      });
    });

    it('should throw NotFoundException if client not found', async () => {
      jest
        .spyOn(service, 'deleteClient')
        .mockRejectedValue(new NotFoundException());
      await expect(controller.deleteClient(1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      jest
        .spyOn(service, 'deleteClient')
        .mockRejectedValue(new Error('Unexpected error'));
      await expect(controller.deleteClient(1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw ForbiddenException if current user is not admin', async () => {
      jest
        .spyOn(service, 'deleteClient')
        .mockRejectedValue(new ForbiddenException());

      await expect(controller.deleteClient(1)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
