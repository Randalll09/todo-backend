import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

type JwtPayload = {
  sub: string;
  username: string;
};

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET', 'def'),
      passReqToCallback: true,
    });
  }
  /** 토큰의 sub 는 표준 클레임이라 그대로 두고, req.user 에는 id 로 담는다 */
  validate(req: Request, payload: JwtPayload): Express.RefreshUser {
    const refreshToken =
      req.headers.authorization?.replace('Bearer', '').trim() ?? '';
    return { id: payload.sub, username: payload.username, refreshToken };
  }
}
