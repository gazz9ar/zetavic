import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateCompanyDTO {
  @IsOptional()
  username: string;

  @IsOptional()
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
