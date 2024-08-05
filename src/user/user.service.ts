import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { filter, forEach } from 'lodash';

import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserInfoDto } from './dto/update-user-info.dto';

@Injectable()
export class UserService {
  @Inject(PrismaService)
  private readonly prismaService: PrismaService;

  @Inject(RedisService)
  private readonly redisService: RedisService;

  private logger = new Logger();

  async register(registerUserDto: RegisterUserDto) {
    const { username, nickname, password, email, captcha } = registerUserDto;

    const redisCaptcha = await this.redisService.get(
      `register_captcha_${email}`,
    );

    if (!redisCaptcha) {
      throw new BadRequestException('验证码已失效');
    }

    if (captcha !== redisCaptcha) {
      throw new BadRequestException('验证码不正确');
    }

    const foundUser = await this.prismaService.user.findUnique({
      where: {
        username: registerUserDto.username,
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

  async findUserById(id: number) {
    return this.prismaService.user.findUnique({
      where: {
        id,
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
  }

  async updatePassword(updatePasswordDto: UpdatePasswordDto) {
    const captcha = await this.redisService.get(
      `update_password_captcha_${updatePasswordDto.email}`,
    );
    if (!captcha) {
      throw new BadRequestException('验证码已失效');
    }
    if (captcha !== updatePasswordDto.captcha) {
      throw new BadRequestException('验证码不正确');
    }
    const foundUser = await this.prismaService.user.findUnique({
      where: {
        username: updatePasswordDto.username,
      },
    });

    try {
      await this.prismaService.user.update({
        where: {
          id: foundUser.id,
        },
        data: {
          password: updatePasswordDto.password,
        },
      });
      return `密码修改成功`;
    } catch (e) {
      this.logger.error(e, UserService);
      return `密码修改失败`;
    }
  }

  async updateUserInfo(id: number, updateUserInfoDto: UpdateUserInfoDto) {
    const captcha = await this.redisService.get(
      `update_user_info_captcha_${updateUserInfoDto.email}`,
    );
    if (!captcha) {
      throw new BadRequestException('验证码已失效');
    }
    if (captcha !== updateUserInfoDto.captcha) {
      throw new BadRequestException('验证码不正确');
    }

    try {
      await this.prismaService.user.update({
        where: {
          id,
        },
        data: {
          avatar: updateUserInfoDto.avatar,
          nickname: updateUserInfoDto.nickname,
        },
      });
      return `用户信息修改成功`;
    } catch (e) {
      this.logger.error(e, UserService);
      return `用户信息修改失败`;
    }
  }
}
