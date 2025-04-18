import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateAddressDTO } from './address.dto';

export class UpdateUserDTO {
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
  @ValidateNested()
  @Type(() => CreateAddressDTO)
  address: CreateAddressDTO;

  @IsOptional()
  @IsBoolean()
  isActive: boolean;
}
