import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as dotenv from 'dotenv';
import SeederService from './seeder/seeder.service';
import { AppDataSource } from './data-source';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  await AppDataSource.initialize();
  await AppDataSource.runMigrations();
  const seeder = app.get(SeederService);
  await seeder.seed();
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
