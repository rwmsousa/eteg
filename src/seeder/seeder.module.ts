import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Client } from '../entities/client.entity';
import SeederService from './seeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Client])],
  providers: [SeederService],
  exports: [SeederService],
})
export default class SeederModule {}
