import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  UnauthorizedException,
  ForbiddenException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';
import { LoginData } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { Request } from 'express';
import { AuthMiddleware } from '../middleware/auth.middleware';

interface CustomRequest extends Request {
  user?: User;
}

@Controller('user')
@UseGuards(AuthMiddleware)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  async login(@Body() loginData: LoginData) {
    try {
      if (!loginData.email || !loginData.password) {
        throw new BadRequestException(
          'Missing required fields: email, password',
        );
      }
      const result = await this.userService.login(loginData);
      return result;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException('Invalid credentials');
      }

      if (error instanceof BadRequestException) {
        throw new BadRequestException(
          'Missing required fields: email, password',
        );
      }
      throw new InternalServerErrorException('Error logging in', error);
    }
  }

  @Post('register')
  async registerUser(@Body() userData: RegisterUserDto) {
    if (!userData.username || !userData.password || !userData.email) {
      throw new BadRequestException(
        'Missing required fields: username, password, email',
      );
    }
    try {
      return await this.userService.registerUser(userData);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException('User already exists');
      }
      throw new InternalServerErrorException('Error registering user', error);
    }
  }

  @Get()
  async listUsers() {
    try {
      return await this.userService.listUsers();
    } catch (error) {
      throw new InternalServerErrorException('Error listing users', error);
    }
  }

  @Get(':id')
  async getUser(@Param('id') id: number) {
    try {
      const user = await this.userService.getUser(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('User not found');
      }
      throw new InternalServerErrorException('Error getting user', error);
    }
  }

  @Put()
  async updateUser(@Body() userData: Partial<User>) {
    if (!userData.email) {
      throw new BadRequestException('Email is required');
    }
    try {
      const result = await this.userService.updateUser(userData);
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('User not found');
      }
      throw new InternalServerErrorException('Error updating user', error);
    }
  }

  @Delete()
  async deleteUser(
    @Body() body: { email: string; [key: string]: any },
    @Req() req: CustomRequest,
  ) {
    const { email } = body;
    if (!email) {
      throw new BadRequestException('Email is required');
    }
    try {
      const currentUser = req.user as User;
      const result = await this.userService.deleteUserByEmail(
        email,
        currentUser,
      );
      if (result.affected === 0) {
        throw new NotFoundException('User not found');
      }
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('User not found');
      }
      if (error instanceof ForbiddenException) {
        throw new ForbiddenException('Only admins can delete users');
      }
      throw new InternalServerErrorException('Error deleting user', error);
    }
  }
}
