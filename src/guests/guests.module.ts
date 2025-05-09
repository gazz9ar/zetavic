import { Module } from '@nestjs/common';
import { UploadController } from './controllers/upload/upload.controller';
import { UploadService } from './services/upload/upload.service';
import { GuestController } from './controllers/guest/guest.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guest } from './types/guest.entity';
import { GuestService } from './services/guest/guest.service';

@Module({
  imports: [TypeOrmModule.forFeature([Guest])],
  controllers: [UploadController, GuestController],
  providers: [UploadService, GuestService],
})
export class GuestsModule {}
