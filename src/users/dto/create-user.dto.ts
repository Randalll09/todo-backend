import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

/**
 * 엔티티에서 파생하지 않는다.
 * User.password / refreshToken 의 @Exclude 는 응답 직렬화를 위한 것인데,
 * OmitType 으로 상속하면 요청 본문에서도 해당 필드가 제거되어 검증 전에 사라진다.
 */
export class CreateUserDto {
  @ApiProperty({
    description: 'The unique username of the user',
    maxLength: 32,
  })
  @IsString()
  @MaxLength(32)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'username may only contain letters, numbers, and underscores',
  })
  username: string;

  @ApiProperty({ description: 'The name of the user', maxLength: 32 })
  @IsString()
  @MaxLength(32)
  name: string;

  @ApiProperty({ description: 'The email address of the user', maxLength: 255 })
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    minLength: 8,
    maxLength: 255,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(255)
  password: string;
}
