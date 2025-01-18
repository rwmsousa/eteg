import { Test, TestingModule } from '@nestjs/testing';
import { UserService, LoginData } from '../../user/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from '../../user/dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { BadRequestException } from '@nestjs/common';

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

      jest.spyOn(repository, 'findOne').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      jest.spyOn(jwt, 'sign').mockReturnValue('token' as never);

      const loginData: LoginData = { email: 'test', password: 'test' };
      expect(await service.login(loginData)).toEqual({ access_token: 'token' });
    });
  });

  describe('registerUser', () => {
    it('should return the registered user', async () => {
      const user = new User();
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest.spyOn(repository, 'save').mockResolvedValue(user);

      const userData: RegisterUserDto = {
        username: 'test',
        password: 'test',
        email: 'test@example.com',
      };
      expect(await service.registerUser(userData)).toBe(user);
    });

    it('should throw BadRequestException if user already exists', async () => {
      const user = new User();
      jest.spyOn(repository, 'findOne').mockResolvedValue(user);

      const userData: RegisterUserDto = {
        username: 'test',
        password: 'test',
        email: 'test@example.com',
      };
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
  });

  describe('getUser', () => {
    it('should return a user', async () => {
      const user = new User();
      jest.spyOn(repository, 'findOne').mockResolvedValue(user);

      expect(await service.getUser(1)).toBe(user);
    });
  });

  describe('updateUser', () => {
    it('should return the updated user', async () => {
      const result = { affected: 1, raw: {}, generatedMaps: [] };
      jest.spyOn(repository, 'update').mockResolvedValue(result);

      expect(await service.updateUser(1, new User())).toBe(result);
    });
  });

  describe('deleteUser', () => {
    it('should return the deleted user', async () => {
      const result = { affected: 1, raw: {} };
      jest.spyOn(repository, 'delete').mockResolvedValue(result);

      expect(await service.deleteUser(1)).toBe(result);
    });
  });
});
