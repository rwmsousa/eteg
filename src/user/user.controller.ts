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
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  async login(@Body() loginData: any) {
    try {
      if (!loginData.username || !loginData.password) {
        throw new BadRequestException(
          'Missing required fields: username, password',
        );
      }
      return await this.userService.login(loginData);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Error logging in', error);
    }
  }

  @Post('register')
  async registerUser(@Body() userData: User) {
    try {
      if (!userData.username || !userData.password) {
        throw new BadRequestException(
          'Missing required fields: username, password',
        );
      }
      return await this.userService.registerUser(userData);
    } catch (error) {
      throw new InternalServerErrorException('Error registering user', error);
    }
  }

  @Get('users')
  async listUsers() {
    try {
      return await this.userService.listUsers();
    } catch (error) {
      throw new InternalServerErrorException('Error listing users', error);
    }
  }

  @Get('users/:id')
  async getUser(@Param('id') id: number) {
    try {
      const user = await this.userService.getUser(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Error getting user', error);
    }
  }

  @Put('users/:id')
  async updateUser(@Param('id') id: number, @Body() userData: User) {
    try {
      const result = await this.userService.updateUser(id, userData);
      if (result.affected === 0) {
        throw new NotFoundException('User not found');
      }
      return result;
    } catch (error) {
      throw new InternalServerErrorException('Error updating user', error);
    }
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: number) {
    try {
      const result = await this.userService.deleteUser(id);
      if (result.affected === 0) {
        throw new NotFoundException('User not found');
      }
      return result;
    } catch (error) {
      throw new InternalServerErrorException('Error deleting user', error);
    }
  }
}
