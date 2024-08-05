import { IsNotEmpty } from 'class-validator';

export class AddFriendDto {
  @IsNotEmpty({
    message: '好友ID不能为空',
  })
  friendId: number;

  reason: string;
}
