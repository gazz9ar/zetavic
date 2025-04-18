import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company, SerializedCompany } from '../types/entities/company.entity';
import { CompanyDTO } from '../types/entities/company.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) {}

  findAll(): Promise<SerializedCompany[]> {
    return this.companyRepository.find();
  }

  async findOne(id: number): Promise<SerializedCompany> {
    const company = await this.companyRepository.findOneBy({ id });
    if (company) return new SerializedCompany(company);
    else throw new NotFoundException();
  }

  async create(companyDTO: CompanyDTO): Promise<SerializedCompany> {
    const newCompany = this.companyRepository.create(companyDTO);

    const company = await this.companyRepository.findOneBy({
      username: newCompany.username,
    });

    if (company && company.username === company.username) {
      throw new HttpException('Company already exists', HttpStatus.BAD_REQUEST);
    }

    return this.companyRepository.save(new SerializedCompany(newCompany));
  }

  async update(id: number, companyDTO: CompanyDTO): Promise<SerializedCompany> {
    const company = await this.companyRepository.findOneBy({
      id,
    });

    if (!company) throw new NotFoundException();

    const modifiedCompany = Object.assign(company, companyDTO);

    return this.companyRepository.save(modifiedCompany);
  }

  async delete(id: number): Promise<void> {
    const result = await this.companyRepository.softDelete(id);

    if (result.affected === 0) {
      throw new NotFoundException();
    }
  }
}
