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
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { LoginData } from './dto/login-data.dto';

interface CustomRequest extends Request {
  user?: User;
}

export class LoginDataDto {
  email: string;
  password: string;
}

@ApiTags('user')
@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginData })
  @ApiResponse({ status: 200, description: 'User logged in successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
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
  @UseGuards(AuthMiddleware)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register a new user (admin only)' })
  @ApiBody({ type: RegisterUserDto })
  @ApiResponse({ status: 201, description: 'User registered successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
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

  @Get()
  @UseGuards(AuthMiddleware)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users (admin only)' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
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

  @Get(':id')
  @UseGuards(AuthMiddleware)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a user by ID (self or admin)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'User retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
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

  @Put()
  @UseGuards(AuthMiddleware)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a user (self or admin)' })
  @ApiBody({ type: RegisterUserDto })
  @ApiResponse({ status: 200, description: 'User updated successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
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
  @UseGuards(AuthMiddleware)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a user (admin only)' })
  @ApiBody({ type: RegisterUserDto })
  @ApiResponse({ status: 200, description: 'User deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
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
