import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { RegisterUserDto } from './dto/register-user.dto';

export interface LoginData {
  email: string;
  password: string;
  role?: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async login(loginData: LoginData) {
    const { email, password } = loginData;
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { username: user.username, sub: user.id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET);

    return { access_token: token };
  }

  async registerUser(userData: RegisterUserDto) {
    try {
      if (!userData.username || !userData.password || !userData.email) {
        throw new BadRequestException(
          'Missing required fields: username, password, email',
        );
      }

      const existingUserByEmail = await this.usersRepository.findOne({
        where: { email: userData.email },
      });
      if (existingUserByEmail) {
        throw new BadRequestException('User already exists');
      }

      const user = new User();
      user.username = userData.username;
      user.password = await bcrypt.hash(userData.password, 10);
      user.email = userData.email;
      user.role = userData.role ?? 'user';

      return await this.usersRepository.save(user);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException('User already exists');
      }
      throw new BadRequestException('Error registering user: ' + error.message);
    }
  }

  async listUsers() {
    try {
      return await this.usersRepository.find();
    } catch (error) {
      throw new InternalServerErrorException(
        'Error listing users: ' + error.message,
      );
    }
  }

  async getUser(id: number) {
    try {
      const user = await this.usersRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error getting user: ' + error.message,
      );
    }
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUser(userData: Partial<User>) {
    if (!userData.email) {
      throw new BadRequestException('Email is required');
    }

    try {
      const user = await this.usersRepository.findOne({
        where: { email: userData.email },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (userData.username) {
        user.username = userData.username;
      }
      if (userData.password) {
        user.password = await bcrypt.hash(userData.password, 10);
      }
      if (userData.role) {
        user.role = userData.role;
      }

      return await this.usersRepository.save(user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error updating user: ' + error.message,
      );
    }
  }

  async deleteUserByEmail(email: string, currentUser: User) {
    if (!currentUser || currentUser.role !== 'admin') {
      throw new ForbiddenException('Only admins can delete users');
    }

    try {
      const user = await this.usersRepository.findOne({ where: { email } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return await this.usersRepository.delete({ email });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error deleting user: ' + error.message,
      );
    }
  }
}
