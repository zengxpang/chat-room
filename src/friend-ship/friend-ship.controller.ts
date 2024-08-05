import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';

import { FriendShipService } from './friend-ship.service';
import { AddFriendDto } from './dto/add-friend.dto';
import { UserInfo } from '../custom.decorator';

@Controller('friend-ship')
export class FriendShipController {
  @Inject()
  private readonly friendShipService: FriendShipService;

  @Post('addFriendRequest')
  addFriendRequest(
    @UserInfo('id') id: number,
    @Body() addFriendDto: AddFriendDto,
  ) {
    return this.friendShipService.addFriendRequest(id, addFriendDto);
  }

  @Get('requestList')
  requestList(@UserInfo('id') id: number) {
    return this.friendShipService.requestList(id);
  }

  @Get('acceptRequest/:id')
  acceptRequest(@Param('id') friendId: number, @UserInfo('id') id: number) {
    return this.friendShipService.acceptRequest(friendId, id);
  }

  @Get('rejectRequest/:id')
  rejectRequest(@Param('id') friendId: number, @UserInfo('id') id: number) {
    return this.friendShipService.rejectRequest(friendId, id);
  }

  @Get('deleteFriend/:id')
  deleteFriend(@Param('id') friendId: number, @UserInfo('id') id: number) {
    return this.friendShipService.deleteFriend(friendId, id);
  }

  @Get('friendShip')
  async friendShip(@UserInfo('id') id: number) {
    return this.friendShipService.getFriendShip(id);
  }
}
