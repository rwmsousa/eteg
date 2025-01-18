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
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';

interface CustomRequest extends Request {
  user?: User;
}

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

      const loginData: LoginData = { email: 'test', password: 'test' };
      expect(await userController.login(loginData)).toEqual(result);
    });

    it('should throw BadRequestException if missing credentials', async () => {
      const loginData: LoginData = { email: '', password: '' };
      await expect(userController.login(loginData)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      jest
        .spyOn(userService, 'login')
        .mockRejectedValue(new UnauthorizedException('Unauthorized'));

      const loginData: LoginData = { email: 'test', password: 'wrong' };
      await expect(userController.login(loginData)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw InternalServerErrorException for unexpected errors', async () => {
      jest
        .spyOn(userService, 'login')
        .mockRejectedValue(new Error('Unexpected error'));

      const loginData: LoginData = { email: 'test', password: 'test' };
      await expect(userController.login(loginData)).rejects.toThrow(
        InternalServerErrorException,
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

    it('should throw BadRequestException if user already exists', async () => {
      jest
        .spyOn(userService, 'registerUser')
        .mockRejectedValue(new BadRequestException('User already exists'));
      const userData: RegisterUserDto = {
        username: 'test',
        password: 'test',
        email: 'test@example.com',
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
    it('should throw BadRequestException if email is not provided', async () => {
      await expect(userController.updateUser({})).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest
        .spyOn(userService, 'updateUser')
        .mockRejectedValue(new NotFoundException('User not found'));
      await expect(
        userController.updateUser({ email: 'test@example.com' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should update the user if found', async () => {
      const user = new User();
      user.email = 'test@example.com';
      jest.spyOn(userService, 'updateUser').mockResolvedValue(user);

      const userData = { email: 'test@example.com', username: 'newUsername' };
      expect(await userController.updateUser(userData)).toBe(user);
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      jest
        .spyOn(userService, 'updateUser')
        .mockRejectedValue(new Error('Unexpected error'));
      const userData = { email: 'test@example.com', username: 'newUsername' };
      await expect(userController.updateUser(userData)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('deleteUser', () => {
    it('should return the deleted user', async () => {
      const result = { affected: 1, raw: {}, generatedMaps: [] };
      jest.spyOn(userService, 'deleteUser').mockResolvedValue(result);

      const req = {
        user: { id: 1, role: 'admin' },
      } as unknown as CustomRequest;
      expect(await userController.deleteUser(1, req)).toBe(result);
    });

    it('should throw NotFoundException if user not found', async () => {
      const result = { affected: 0, raw: {}, generatedMaps: [] };
      jest.spyOn(userService, 'deleteUser').mockResolvedValue(result);

      const req = {
        user: { id: 1, role: 'admin' },
      } as unknown as CustomRequest;
      await expect(userController.deleteUser(1, req)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if current user is not admin', async () => {
      jest
        .spyOn(userService, 'deleteUser')
        .mockRejectedValue(
          new ForbiddenException('Only admins can delete users'),
        );

      const req = { user: { id: 1, role: 'user' } } as unknown as CustomRequest;
      await expect(userController.deleteUser(1, req)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      jest
        .spyOn(userService, 'deleteUser')
        .mockRejectedValue(new Error('Unexpected error'));

      const req = {
        user: { id: 1, role: 'admin' },
      } as unknown as CustomRequest;
      await expect(userController.deleteUser(1, req)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
