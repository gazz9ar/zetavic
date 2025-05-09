import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGuestDTO {
  @IsNotEmpty()
  externalId: number;

  @IsNotEmpty()
  room: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}
