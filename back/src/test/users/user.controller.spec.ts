import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../user/user.controller';
import { UserService } from '../../user/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { RegisterUserDto } from '../../user/dto/register-user.dto';
import { LoginData } from '../../user/dto/login-data.dto';
import { registerUserSchema } from '../../user/dto/register-user.schema';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);

    // Mock the logger
    jest.spyOn(controller['logger'], 'error').mockImplementation(() => {});
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return a token', async () => {
      const result = { access_token: 'token' };
      jest.spyOn(service, 'login').mockResolvedValue(result);

      const loginData: LoginData = { email: 'test', password: 'test' };
      expect(await controller.login(loginData)).toEqual(result);
    });

    it('should throw BadRequestException if missing credentials', async () => {
      const loginData: LoginData = { email: '', password: '' };
      await expect(controller.login(loginData)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      jest
        .spyOn(service, 'login')
        .mockRejectedValue(new UnauthorizedException('Unauthorized'));

      const loginData: LoginData = { email: 'test', password: 'wrong' };
      await expect(controller.login(loginData)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw InternalServerErrorException for unexpected errors', async () => {
      jest
        .spyOn(service, 'login')
        .mockRejectedValue(new Error('Unexpected error'));

      const loginData: LoginData = { email: 'test', password: 'test' };
      await expect(controller.login(loginData)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('registerUser', () => {
    it('should register a user with valid data', async () => {
      const userData: RegisterUserDto = {
        username: 'johndoe',
        password: 'password123',
        email: 'john@example.com',
      };
      const result = new User();
      jest.spyOn(service, 'registerUser').mockResolvedValue(result);

      const req = { user: { role: 'admin' } } as any;
      expect(await controller.registerUser(userData, req)).toBe(result);
      expect(service.registerUser).toHaveBeenCalledWith(userData);
    });

    it('should throw BadRequestException if required fields are missing', async () => {
      const userData: Partial<RegisterUserDto> = {
        username: 'johndoe',
      };

      const req = { user: { role: 'admin' } } as any;
      await expect(
        controller.registerUser(userData as RegisterUserDto, req),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if user already exists', async () => {
      const userData: RegisterUserDto = {
        username: 'johndoe',
        password: 'password123',
        email: 'john@example.com',
      };
      jest
        .spyOn(service, 'registerUser')
        .mockRejectedValue(new BadRequestException('User already exists'));

      const req = { user: { role: 'admin' } } as any;
      await expect(controller.registerUser(userData, req)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if schema validation fails', async () => {
      const userData: RegisterUserDto = {
        username: 'jo',
        password: '123',
        email: 'invalid-email',
      };
      const { error } = registerUserSchema.validate(userData);
      expect(error).toBeDefined();

      const req = { user: { role: 'admin' } } as any;
      await expect(controller.registerUser(userData, req)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw InternalServerErrorException if there is a database error', async () => {
      const userData: RegisterUserDto = {
        username: 'johndoe',
        password: 'password123',
        email: 'john@example.com',
      };
      jest
        .spyOn(service, 'registerUser')
        .mockRejectedValue(new Error('Database error'));

      const req = { user: { role: 'admin' } } as any;
      await expect(controller.registerUser(userData, req)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('listUsers', () => {
    it('should return an array of users', async () => {
      const users = [new User()];
      jest.spyOn(service, 'listUsers').mockResolvedValue(users);

      const req = { user: { role: 'admin' } } as any;
      expect(await controller.listUsers(req)).toBe(users);
    });

    it('should throw ForbiddenException if current user is not admin', async () => {
      const req = { user: { role: 'user' } } as any;
      await expect(controller.listUsers(req)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      jest
        .spyOn(service, 'listUsers')
        .mockRejectedValue(new Error('Unexpected error'));
      const req = { user: { role: 'admin' } } as any;
      await expect(controller.listUsers(req)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('getUser', () => {
    it('should return a user', async () => {
      const user = new User();
      jest.spyOn(service, 'getUser').mockResolvedValue(user);

      const req = { user: { role: 'admin' } } as any;
      expect(await controller.getUser(1, req)).toBe(user);
    });

    it('should throw ForbiddenException if current user is not admin and not the user being accessed', async () => {
      const req = { user: { role: 'user', id: 2 } } as any;
      await expect(controller.getUser(1, req)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(service, 'getUser').mockResolvedValue(null);
      const req = { user: { role: 'admin' } } as any;
      await expect(controller.getUser(1, req)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      jest
        .spyOn(service, 'getUser')
        .mockRejectedValue(new Error('Unexpected error'));
      const req = { user: { role: 'admin' } } as any;
      await expect(controller.getUser(1, req)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('updateUser', () => {
    it('should update the user if found', async () => {
      const user = new User();
      user.email = 'test@example.com';
      jest.spyOn(service, 'updateUser').mockResolvedValue(user);

      const userData = { email: 'test@example.com', username: 'newUsername' };
      const req = { user: { role: 'admin' } } as any;
      expect(await controller.updateUser(userData, req)).toBe(user);
    });

    it('should throw ForbiddenException if current user is not admin and not the user being updated', async () => {
      const userData = { email: 'test@example.com', username: 'newUsername' };
      const req = { user: { role: 'user', email: 'other@example.com' } } as any;
      await expect(controller.updateUser(userData, req)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw BadRequestException if email is not provided', async () => {
      const req = { user: { role: 'admin' } } as any;
      await expect(controller.updateUser({}, req)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest
        .spyOn(service, 'updateUser')
        .mockRejectedValue(new NotFoundException('User not found'));
      const userData = { email: 'test@example.com', username: 'newUsername' };
      const req = { user: { role: 'admin' } } as any;
      await expect(controller.updateUser(userData, req)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      jest
        .spyOn(service, 'updateUser')
        .mockRejectedValue(new Error('Unexpected error'));
      const userData = { email: 'test@example.com', username: 'newUsername' };
      const req = { user: { role: 'admin' } } as any;
      await expect(controller.updateUser(userData, req)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const body = {
        email: 'john@example.com',
        username: 'user3',
        password: 'password3',
        role: 'user',
      };
      const currentUser = { role: 'admin' } as User;
      const req = { user: currentUser } as any;
      const deleteResult = { affected: 1, raw: {} };
      jest.spyOn(service, 'deleteUserByEmail').mockResolvedValue(deleteResult);

      expect(await controller.deleteUser(body, req)).toEqual(deleteResult);
    });

    it('should throw NotFoundException if user not found', async () => {
      const body = {
        email: 'john@example.com',
        username: 'user3',
        password: 'password3',
        role: 'user',
      };
      const currentUser = { role: 'admin' } as User;
      const req = { user: currentUser } as any;
      jest
        .spyOn(service, 'deleteUserByEmail')
        .mockRejectedValue(new NotFoundException());

      await expect(controller.deleteUser(body, req)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if current user is not admin', async () => {
      const body = {
        email: 'john@example.com',
        username: 'user3',
        password: 'password3',
        role: 'user',
      };
      const currentUser = { role: 'user' } as User;
      const req = { user: currentUser } as any;
      jest
        .spyOn(service, 'deleteUserByEmail')
        .mockRejectedValue(new ForbiddenException());

      await expect(controller.deleteUser(body, req)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      const body = {
        email: 'john@example.com',
        username: 'user3',
        password: 'password3',
        role: 'user',
      };
      const currentUser = { role: 'admin' } as User;
      const req = { user: currentUser } as any;
      jest
        .spyOn(service, 'deleteUserByEmail')
        .mockRejectedValue(new Error('Unexpected error'));

      await expect(controller.deleteUser(body, req)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
