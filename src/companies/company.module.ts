import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyService } from './services/company.service';
import { CompanyController } from './controllers/user.controller';
import { Company } from './types/entities/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Company])],
  providers: [CompanyService],
  controllers: [CompanyController],
})
export class CompanyModule {}
