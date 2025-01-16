import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminService {
  login(loginData: any) {
    // Logic to authenticate admin user
    console.log('Admin login', loginData);
  }
}
