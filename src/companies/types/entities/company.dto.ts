import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CompanyDTO {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsBoolean()
  isActive: boolean;
}
