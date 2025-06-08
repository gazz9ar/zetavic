import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateCompanyDTO {
  @IsOptional()
  email: string;

  @IsOptional()
  password: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsBoolean()
  isActive: boolean;
}
