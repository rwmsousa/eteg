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
  Logger,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import { Request } from 'express';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { registerUserSchema } from './dto/register-user.schema';

interface CustomRequest extends Request {
  user?: User;
}

interface LoginData {
  email: string;
  password: string;
}

@Controller('user')
@UseGuards(AuthMiddleware)
export class UserController {
  private readonly logger = new Logger(UserController.name);

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

  @UseGuards(AuthMiddleware)
  @Post('register')
  async registerUser(
    @Body() userData: RegisterUserDto,
    @Req() req: CustomRequest,
  ) {
    const { error } = registerUserSchema.validate(userData);
    if (error) {
      throw new BadRequestException(error.details[0].message);
    }
    const currentUser = req.user as User;
    if (!currentUser) {
      throw new UnauthorizedException('User not authenticated');
    }
    if (!currentUser.role) {
      throw new UnauthorizedException('User role not found');
    }
    if (currentUser.role !== 'admin') {
      throw new ForbiddenException('Only admins can create new users');
    }
    if (!userData.username || !userData.password || !userData.email) {
      throw new BadRequestException(
        'Missing required fields: username, password, email',
      );
    }
    try {
      return await this.userService.registerUser(userData);
    } catch (error) {
      this.logger.error('Error registering user', error.stack);
      if (error instanceof BadRequestException) {
        throw new BadRequestException('User already exists');
      }
      throw new InternalServerErrorException('Error registering user', error);
    }
  }

  @UseGuards(AuthMiddleware)
  @Get()
  async listUsers(@Req() req: CustomRequest) {
    const currentUser = req.user as User;
    if (!currentUser || !currentUser.role) {
      throw new UnauthorizedException('User not authenticated');
    }
    if (currentUser.role !== 'admin') {
      throw new ForbiddenException('Only admins can list all users');
    }
    try {
      return await this.userService.listUsers();
    } catch (error) {
      throw new InternalServerErrorException('Error listing users', error);
    }
  }

  @UseGuards(AuthMiddleware)
  @Get(':id')
  async getUser(@Param('id') id: number, @Req() req: CustomRequest) {
    const currentUser = req.user as User;
    if (!currentUser || !currentUser.role) {
      throw new UnauthorizedException('User not authenticated');
    }
    if (currentUser.role !== 'admin' && currentUser.id !== id) {
      throw new ForbiddenException('You can only access your own data');
    }
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

  @UseGuards(AuthMiddleware)
  @Put()
  async updateUser(@Body() userData: Partial<User>, @Req() req: CustomRequest) {
    const currentUser = req.user as User;
    if (!currentUser || !currentUser.role) {
      throw new UnauthorizedException('User not authenticated');
    }
    if (currentUser.role !== 'admin' && currentUser.email !== userData.email) {
      throw new ForbiddenException('You can only update your own data');
    }
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
      if (!currentUser || !currentUser.role) {
        throw new UnauthorizedException('User not authenticated');
      }
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
