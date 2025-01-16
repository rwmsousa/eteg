import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { User } from '../entities/user.entity';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  login(@Body() loginData: any) {
    return this.adminService.login(loginData);
  }

  @Post('register')
  registerUser(@Body() userData: User) {
    return this.adminService.registerUser(userData);
  }

  @Get('users')
  listUsers() {
    return this.adminService.listUsers();
  }

  @Get('users/:id')
  getUser(@Param('id') id: number) {
    return this.adminService.getUser(id);
  }

  @Put('users/:id')
  updateUser(@Param('id') id: number, @Body() userData: User) {
    return this.adminService.updateUser(id, userData);
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: number) {
    return this.adminService.deleteUser(id);
  }
}
