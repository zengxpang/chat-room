import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class UserService {
  @Inject(PrismaService)
  private readonly prismaService: PrismaService;

  @Inject(RedisService)
  private readonly redisService: RedisService;

  private logger = new Logger();

  async register(registerUser: RegisterUserDto) {
    const { username, nickname, password, email, captcha } = registerUser;

    const redisCaptcha = await this.redisService.get(
      `register_captcha_${email}`,
    );

    console.log(registerUser);

    if (!redisCaptcha) {
      throw new BadRequestException('验证码已失效');
    }

    if (captcha !== redisCaptcha) {
      throw new BadRequestException('验证码不正确');
    }

    const foundUser = await this.prismaService.user.findUnique({
      where: {
        username: registerUser.username,
      },
    });

    if (foundUser) {
      throw new BadRequestException('用户已存在');
    }

    try {
      return await this.prismaService.user.create({
        data: {
          username,
          password,
          nickname,
          email,
        },
        select: {
          id: true,
          username: true,
          nickname: true,
          email: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (e) {
      this.logger.error(e, UserService);
      return null;
    }
  }
}
