import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';

@Injectable()
export class AdminService {
  private users: User[] = [];

  login(loginData: any) {
    // Logic to authenticate admin user
    console.log('Admin login', loginData);
  }

  registerUser(userData: User) {
    this.users.push(userData);
    return userData;
  }

  listUsers() {
    return this.users;
  }

  getUser(id: number) {
    return this.users.find((user) => user.id === id);
  }

  updateUser(id: number, userData: User) {
    const index = this.users.findIndex((user) => user.id === id);
    if (index !== -1) {
      this.users[index] = userData;
      return userData;
    }
    return null;
  }

  deleteUser(id: number) {
    const index = this.users.findIndex((user) => user.id === id);
    if (index !== -1) {
      const deletedUser = this.users.splice(index, 1);
      return deletedUser[0];
    }
    return null;
  }
}
