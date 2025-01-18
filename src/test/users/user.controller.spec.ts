import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../user/user.controller';
import { UserService } from '../../user/user.service';
import { User } from '../../entities/user.entity';
import { LoginData } from '../../user/user.service';
import { RegisterUserDto } from '../../user/dto/register-user.dto';
import {
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            login: jest.fn(),
            registerUser: jest.fn(),
            listUsers: jest.fn(),
            getUser: jest.fn(),
            updateUser: jest.fn(),
            deleteUser: jest.fn(),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('login', () => {
    it('should return a token', async () => {
      const result = { access_token: 'token' };
      jest.spyOn(userService, 'login').mockResolvedValue(result);

      const loginData: LoginData = { username: 'test', password: 'test' };
      expect(await userController.login(loginData)).toEqual(result);
    });

    it('should throw BadRequestException if missing credentials', async () => {
      const loginData: LoginData = { username: '', password: '' };
      await expect(userController.login(loginData)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      jest
        .spyOn(userService, 'login')
        .mockRejectedValue(new UnauthorizedException('Unauthorized'));

      const loginData: LoginData = { username: 'test', password: 'wrong' };
      await expect(userController.login(loginData)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw InternalServerErrorException for unexpected errors', async () => {
      jest
        .spyOn(userService, 'login')
        .mockRejectedValue(new Error('Unexpected error'));

      const loginData: LoginData = { username: 'test', password: 'test' };
      await expect(userController.login(loginData)).rejects.toThrow(
        'Error logging in',
      );
    });
  });

  describe('registerUser', () => {
    it('should return the registered user', async () => {
      const user = new User();
      jest.spyOn(userService, 'registerUser').mockResolvedValue(user);

      const userData: RegisterUserDto = {
        username: 'test',
        password: 'test',
        email: 'test@example.com',
      };
      expect(await userController.registerUser(userData)).toBe(user);
    });

    it('should throw BadRequestException if missing credentials', async () => {
      const userData: RegisterUserDto = {
        username: '',
        password: '',
        email: '',
      };
      await expect(userController.registerUser(userData)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      jest
        .spyOn(userService, 'registerUser')
        .mockRejectedValue(new Error('Database error'));
      const userData: RegisterUserDto = {
        username: 'test',
        password: 'test',
        email: 'test@example.com',
      };
      await expect(userController.registerUser(userData)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('listUsers', () => {
    it('should return an array of users', async () => {
      const users = [new User()];
      jest.spyOn(userService, 'listUsers').mockResolvedValue(users);

      expect(await userController.listUsers()).toBe(users);
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      jest
        .spyOn(userService, 'listUsers')
        .mockRejectedValue(new Error('Unexpected error'));
      await expect(userController.listUsers()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('getUser', () => {
    it('should return a user', async () => {
      const user = new User();
      jest.spyOn(userService, 'getUser').mockResolvedValue(user);

      expect(await userController.getUser(1)).toBe(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(userService, 'getUser').mockResolvedValue(null);
      await expect(userController.getUser(1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      jest
        .spyOn(userService, 'getUser')
        .mockRejectedValue(new Error('Unexpected error'));
      await expect(userController.getUser(1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('updateUser', () => {
    it('should return the updated user', async () => {
      const result = { affected: 1, raw: {}, generatedMaps: [] };
      jest.spyOn(userService, 'updateUser').mockResolvedValue(result);

      expect(await userController.updateUser(1, new User())).toBe(result);
    });

    it('should throw NotFoundException if user not found', async () => {
      const result = { affected: 0, raw: {}, generatedMaps: [] };
      jest.spyOn(userService, 'updateUser').mockResolvedValue(result);
      await expect(userController.updateUser(1, new User())).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      jest
        .spyOn(userService, 'updateUser')
        .mockRejectedValue(new Error('Unexpected error'));
      await expect(userController.updateUser(1, new User())).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('deleteUser', () => {
    it('should return the deleted user', async () => {
      const result = { affected: 1, raw: {}, generatedMaps: [] };
      jest.spyOn(userService, 'deleteUser').mockResolvedValue(result);

      expect(await userController.deleteUser(1)).toBe(result);
    });

    it('should throw NotFoundException if user not found', async () => {
      const result = { affected: 0, raw: {}, generatedMaps: [] };
      jest.spyOn(userService, 'deleteUser').mockResolvedValue(result);
      await expect(userController.deleteUser(1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      jest
        .spyOn(userService, 'deleteUser')
        .mockRejectedValue(new Error('Unexpected error'));
      await expect(userController.deleteUser(1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
