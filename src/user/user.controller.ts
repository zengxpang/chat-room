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
}
