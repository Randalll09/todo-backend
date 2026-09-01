import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

/**
 * req.user 에서 값을 꺼낸다. 인자를 주면 해당 필드만, 없으면 객체 전체를 반환한다.
 * 반드시 인증 가드가 걸린 핸들러에서만 사용해야 한다.
 */
export const CurrentUser = createParamDecorator(
  (data: keyof Express.User | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);
