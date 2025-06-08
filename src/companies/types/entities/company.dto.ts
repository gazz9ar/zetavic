import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CompanyDTO {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsBoolean()
  isActive: boolean;
}
