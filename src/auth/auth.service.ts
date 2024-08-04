import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { omit } from 'lodash';

import { md5 } from '../utils';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  @Inject(PrismaService)
  private readonly prismaService: PrismaService;

  @Inject()
  private readonly jwtService: JwtService;

  async validateUser(username: string, password: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        username,
      },
    });
    if (!user) {
      throw new BadRequestException('用户不存在');
    }
    // md5(password)
    if (password !== user.password) {
      throw new BadRequestException('密码错误');
    }
    return omit(user, ['password']);
  }

  async login(user: any) {
    // 这里的user就是上面的validateUser返回的user
    return {
      token: this.jwtService.sign(user),
      user,
    };
  }
}
