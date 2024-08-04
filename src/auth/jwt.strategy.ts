import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // 路由提供了一个过期的 JWT，请求将被拒绝，并发送一个 401 Unauthorized 响应
      secretOrKey: 'zxp',
    });
  }

  async validate(payload: any) {
    // 放在 req.user 中
    return payload;
  }
}
