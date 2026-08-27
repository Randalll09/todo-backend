import { User } from '../entities/user.entity';
import { OmitType } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MaxLength } from 'class-validator';

export class CreateUserDto extends OmitType(User, [
  'id',
  'refreshToken',
  'todos',
] as const) {
  @IsString()
  @MaxLength(32)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'username may only contain letters, numbers, and underscores',
  })
  username: string;

  @IsString()
  @MaxLength(32)
  name: string;

  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsString()
  @MaxLength(255)
  password: string;
}
