import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateUserInfoDto {
  avatar: string;

  @IsNotEmpty({
    message: '昵称不能为空',
  })
  nickname: string;

  @IsNotEmpty({
    message: '邮箱不能为空',
  })
  @IsEmail(
    {},
    {
      message: '邮箱格式不正确',
    },
  )
  email: string;

  @IsNotEmpty({
    message: '验证码不能为空',
  })
  captcha: string;
}
