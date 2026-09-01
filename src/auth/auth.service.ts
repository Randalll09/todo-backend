import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'node:crypto';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

/** 만료 시간은 초 단위 숫자로 다뤄 문자열 파싱 모호함을 피한다. */
const ACCESS_TOKEN_TTL_SECONDS = 15 * 60;
const REFRESH_TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60;

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

type JwtPayload = {
  sub: string;
  username: string;
  /** 토큰 고유 식별자. iat 는 초 단위라 같은 초에 발급된 토큰이 동일해지므로 필요하다. */
  jti: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signup(dto: CreateUserDto): Promise<Tokens> {
    const user = await this.usersService.create(dto);
    return this.issueTokens(user.id, user.username);
  }

  /**
   * username 이 없든 비밀번호가 틀리든 동일한 예외를 던진다.
   * 응답을 구분하면 가입된 계정을 추측당할 수 있다.
   */
  async login(dto: LoginDto): Promise<Tokens> {
    const user = await this.usersService.findByUsernameWithSecrets(
      dto.username,
    );
    if (!user) {
      /** 존재하지 않는 계정에서도 해시 비용을 치러 타이밍 차이를 줄인다. */
      await bcrypt.compare(dto.password, DUMMY_HASH);
      throw new ForbiddenException('invalid credentials');
    }

    const matches = await bcrypt.compare(dto.password, user.password);
    if (!matches) throw new ForbiddenException('invalid credentials');

    return this.issueTokens(user.id, user.username);
  }

  async logout(userId: string): Promise<void> {
    await this.usersService.clearRefreshToken(userId);
  }

  /**
   * 제시된 refresh token 이 DB 에 저장된 해시와 일치할 때만 새 토큰을 발급한다.
   * 발급 시마다 저장된 해시를 교체하므로(rotation) 탈취된 옛 토큰은 무효가 된다.
   */
  async refresh(userId: string, refreshToken: string): Promise<Tokens> {
    const user = await this.usersService.findByIdWithRefreshToken(userId);
    if (!user || !user.refreshToken) {
      throw new ForbiddenException('access denied');
    }

    const matches = this.usersService.verifyRefreshToken(
      refreshToken,
      user.refreshToken,
    );
    if (!matches) throw new ForbiddenException('access denied');

    return this.issueTokens(user.id, user.username);
  }

  private async issueTokens(userId: string, username: string): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, username, jti: randomUUID() } satisfies JwtPayload,
        {
          secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
          expiresIn: this.configService.get<number>(
            'JWT_ACCESS_EXPIRES_SECONDS',
            ACCESS_TOKEN_TTL_SECONDS,
          ),
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, username, jti: randomUUID() } satisfies JwtPayload,
        {
          secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get<number>(
            'JWT_REFRESH_EXPIRES_SECONDS',
            REFRESH_TOKEN_TTL_SECONDS,
          ),
        },
      ),
    ]);

    await this.usersService.setRefreshToken(userId, refreshToken);
    return { accessToken, refreshToken };
  }
}

/**
 * 존재하지 않는 사용자로 로그인 시도할 때 비교 대상으로만 쓰는 더미 해시.
 * 어떤 평문과도 일치하지 않으며, 실제 bcrypt 해시라 비교 비용이 정상 경로와 같다.
 */
const DUMMY_HASH =
  '$2b$12$Z66Ii6O8b5KfXLg5JTFqPO3mO.Ai/N9tgZHYMwtudKT8ePEtD8RSe';
