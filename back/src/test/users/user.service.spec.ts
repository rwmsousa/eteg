import { Test, TestingModule } from '@nestjs/testing';
import { UserService, LoginData } from '../../user/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from '../../user/dto/register-user.dto';
import { registerUserSchema } from '../../user/dto/register-user.schema';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import {
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return a token', async () => {
      const user = new User();
      user.username = 'test';
      user.password = await bcrypt.hash('test', 10);
      user.role = 'user';

      jest.spyOn(repository, 'findOne').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      jest.spyOn(jwt, 'sign').mockReturnValue('token' as never);

      const loginData: LoginData = { email: 'test', password: 'test' };
      expect(await service.login(loginData)).toEqual({ access_token: 'token' });
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      const loginData: LoginData = { email: 'test', password: 'test' };
      await expect(service.login(loginData)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('registerUser', () => {
    it('should return the registered user', async () => {
      const user = new User();
      user.role = 'user';
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest.spyOn(repository, 'save').mockResolvedValue(user);

      const userData: RegisterUserDto = {
        username: 'test',
        password: 'test123',
        email: 'test@example.com',
      };
      expect(await service.registerUser(userData)).toBe(user);
    });

    it('should throw BadRequestException if user already exists', async () => {
      const user = new User();
      jest.spyOn(repository, 'findOne').mockResolvedValue(user);

      const userData: RegisterUserDto = {
        username: 'test',
        password: 'test123',
        email: 'test@example.com',
      };
      await expect(service.registerUser(userData)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if required fields are missing', async () => {
      const userData: RegisterUserDto = {
        username: '',
        password: '',
        email: '',
      };
      await expect(service.registerUser(userData)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if schema validation fails', async () => {
      const userData: RegisterUserDto = {
        username: 'te',
        password: '123',
        email: 'invalid-email',
      };
      const { error } = registerUserSchema.validate(userData);
      expect(error).toBeDefined();
      await expect(service.registerUser(userData)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('listUsers', () => {
    it('should return an array of users', async () => {
      const users = [new User()];
      jest.spyOn(repository, 'find').mockResolvedValue(users);

      expect(await service.listUsers()).toBe(users);
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      jest
        .spyOn(repository, 'find')
        .mockRejectedValue(new Error('Unexpected error'));
      await expect(service.listUsers()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('getUser', () => {
    it('should return a user', async () => {
      const user = new User();
      jest.spyOn(repository, 'findOne').mockResolvedValue(user);

      expect(await service.getUser(1)).toBe(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      await expect(service.getUser(1)).rejects.toThrow(
        new NotFoundException('User not found'),
      );
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      jest
        .spyOn(repository, 'findOne')
        .mockRejectedValue(new Error('Unexpected error'));
      await expect(service.getUser(1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('updateUser', () => {
    it('should throw BadRequestException if email is not provided', async () => {
      await expect(service.updateUser({})).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      await expect(
        service.updateUser({ email: 'test@example.com' }),
      ).rejects.toThrow(new NotFoundException('User not found'));
    });

    it('should update the user if found', async () => {
      const user = new User();
      user.email = 'test@example.com';
      jest.spyOn(repository, 'findOne').mockResolvedValue(user);
      jest.spyOn(repository, 'save').mockResolvedValue(user);

      const userData = { email: 'test@example.com', username: 'newUsername' };
      expect(await service.updateUser(userData)).toBe(user);
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      jest
        .spyOn(repository, 'findOne')
        .mockRejectedValue(new Error('Unexpected error'));
      await expect(
        service.updateUser({ email: 'test@example.com' }),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('deleteUserByEmail', () => {
    it('should delete a user', async () => {
      const email = 'john@example.com';
      const currentUser = { role: 'admin' } as User;
      const deleteResult = { affected: 1, raw: {} };
      jest.spyOn(repository, 'findOne').mockResolvedValue({ email } as User);
      jest.spyOn(repository, 'delete').mockResolvedValue(deleteResult);

      expect(await service.deleteUserByEmail(email, currentUser)).toEqual(
        deleteResult,
      );
    });

    it('should throw NotFoundException if user not found', async () => {
      const email = 'john@example.com';
      const currentUser = { role: 'admin' } as User;
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(
        service.deleteUserByEmail(email, currentUser),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if current user is not admin', async () => {
      const email = 'john@example.com';
      const currentUser = { role: 'user' } as User;

      await expect(
        service.deleteUserByEmail(email, currentUser),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      const email = 'john@example.com';
      const currentUser = { role: 'admin' } as User;
      jest
        .spyOn(repository, 'findOne')
        .mockRejectedValue(new Error('Unexpected error'));

      await expect(
        service.deleteUserByEmail(email, currentUser),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});
