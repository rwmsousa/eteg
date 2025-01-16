import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule } from './clients/clients.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [ClientsModule, AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
