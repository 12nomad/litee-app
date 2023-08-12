import { IsEmail, IsString } from 'class-validator';

export class EditUserDto {
  @IsString()
  username: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  profileImage: string;
}
