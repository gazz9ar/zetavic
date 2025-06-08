import {
  Controller,
  Get,
  Post,
  Param,
  ParseIntPipe,
  ValidationPipe,
  Body,
  UsePipes,
  UseInterceptors,
  ClassSerializerInterceptor,
  Put,
  Delete,
} from '@nestjs/common';
import { CompanyService } from '../services/company.service';
import { Company, SerializedCompany } from '../types/entities/company.entity';
import { CompanyDTO } from '../types/entities/company.dto';
import { CreateCompanyDTO } from '../types/entities/create-company.dto';

@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  async findAll(): Promise<Company[]> {
    return this.companyService.findAll();
  }

  @Get(':id')
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SerializedCompany> {
    return this.companyService.findOne(id);
  }

  @Post('create')
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  async create(@Body() user: CompanyDTO): Promise<SerializedCompany> {
    return this.companyService.create(user);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  async update(
    @Param('id') id: number,
    @Body() company: CreateCompanyDTO,
  ): Promise<SerializedCompany> {
    return this.companyService.update(id, company);
  }

  @Delete(':id')
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  async delete(@Param('id') id: number): Promise<any> {
    return this.companyService.delete(id);
  }
}
