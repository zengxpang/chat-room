import {
  Get,
  Body,
  Controller,
  Inject,
  Post,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';

import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { RedisService } from '../redis/redis.service';
import { EmailService } from '../email/email.service';
import { IsPublic } from '../is-public.decorator';
import { LocalAuthGuard } from '../local-auth.guard';
import { AuthService } from '../auth/auth.service';
import { UserInfo } from '../custom.decorator';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserInfoDto } from './dto/update-user-info.dto';

declare module 'express' {
  interface Request {
    user: Record<string, any>;
  }
}

@Controller('user')
export class UserController {
  @Inject(UserService)
  private readonly userService: UserService;

  @Inject(RedisService)
  private readonly redisService: RedisService;

  @Inject(EmailService)
  private readonly emailService: EmailService;

  @Inject(AuthService)
  private readonly authService: AuthService;

  @IsPublic()
  @Get('registerCaptcha')
  async captcha(@Query('email') email: string) {
    const code = Math.random().toString().slice(2, 8);

    await this.redisService.set(`register_captcha_${email}`, code, 5 * 60);

    await this.emailService.sendMail({
      to: email,
      subject: '注册验证码',
      html: `<p>你的注册验证码是 ${code}</p>`,
    });
    return '发送成功';
  }

  @IsPublic()
  @Post('register')
  async register(@Body() registerUser: RegisterUserDto) {
    return this.userService.register(registerUser);
  }

  @IsPublic()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req: Request) {
    return this.authService.login(req.user);
  }

  @Get('userInfo')
  async userInfo(@UserInfo('id') id: number) {
    return this.userService.findUserById(id);
  }

  @Get('updatePasswordCaptcha')
  async updatePasswordCaptcha(@UserInfo('email') email: string) {
    const code = Math.random().toString().slice(2, 8);

    await this.redisService.set(
      `update_password_captcha_${email}`,
      code,
      5 * 60,
    );

    await this.emailService.sendMail({
      to: email,
      subject: '修改密码验证码',
      html: `<p>你的修改密码验证码是 ${code}</p>`,
    });
    return '发送成功';
  }

  @Post('updatePassword')
  async updatePassword(@Body() updatePasswordDto: UpdatePasswordDto) {
    return this.userService.updatePassword(updatePasswordDto);
  }

  @Get('updateUserInfoCaptcha')
  async updateUserInfoCaptcha(@UserInfo('email') email: string) {
    const code = Math.random().toString().slice(2, 8);

    await this.redisService.set(
      `update_user_info_captcha_${email}`,
      code,
      5 * 60,
    );

    await this.emailService.sendMail({
      to: email,
      subject: '修改用户信息验证码',
      html: `<p>你的修改用户信息验证码是 ${code}</p>`,
    });
    return '发送成功';
  }

  @Post('updateUserInfo')
  async updateUserInfo(
    @UserInfo('id') id: number,
    @Body() updateUserInfo: UpdateUserInfoDto,
  ) {
    return this.userService.updateUserInfo(id, updateUserInfo);
  }

  @Get('friendShip')
  async friendShip(@UserInfo('id') id: number) {
    return this.userService.getFriendShip(id);
  }
}
