/**
 * Passport 는 strategy 의 validate() 반환값을 req.user 에 담는다.
 * @types/passport 없이도 쓸 수 있도록 Request.user 를 직접 선언한다.
 */
declare global {
  namespace Express {
    interface User {
      id: string;
      username: string;
    }

    /** refresh 전략은 원문 토큰까지 함께 실어 보낸다. */
    type RefreshUser = User & { refreshToken: string };
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: Express.User;
  }
}

export {};
