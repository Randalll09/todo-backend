import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'The username of the user', maxLength: 32 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  username: string;

  @ApiProperty({ description: 'The password of the user', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  password: string;
}
