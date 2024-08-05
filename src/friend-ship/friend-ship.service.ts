import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { FriendRequestStatus } from '@prisma/client';
import { filter, forEach, isEmpty } from 'lodash';

import { AddFriendDto } from './dto/add-friend.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';

@Injectable()
export class FriendShipService {
  @Inject()
  private readonly prismaService: PrismaService;

  @Inject()
  private readonly userService: UserService;

  addFriendRequest(id: number, addFriendDto: AddFriendDto) {
    return this.prismaService.friendRequest.create({
      data: {
        fromUserId: addFriendDto.friendId,
        toUserId: id,
        reason: addFriendDto.reason,
        status: FriendRequestStatus.Pending,
      },
    });
  }

  requestList(id: number) {
    return this.prismaService.friendRequest.findMany({
      where: {
        toUserId: id,
      },
    });
  }

  async acceptRequest(friendId: number, id: number) {
    if (!friendId) {
      throw new BadRequestException(`添加的好友ID不能为空`);
    }
    await this.prismaService.friendRequest.updateMany({
      where: {
        fromUserId: friendId,
        toUserId: id,
        status: FriendRequestStatus.Pending,
      },
      data: {
        status: FriendRequestStatus.Accepted,
      },
    });
    const res = await this.prismaService.friendShip.findMany({
      where: {
        userId: id,
        friendId,
      },
    });
    if (isEmpty(res)) {
      await this.prismaService.friendShip.create({
        data: {
          userId: id,
          friendId,
        },
      });
    }
    return `用户${id}已接受用户${friendId}的好友请求`;
  }

  async rejectRequest(friendId: number, id: number) {
    if (!friendId) {
      throw new BadRequestException(`添加的好友ID不能为空`);
    }
    await this.prismaService.friendRequest.updateMany({
      where: {
        fromUserId: friendId,
        toUserId: id,
        status: FriendRequestStatus.Pending,
      },
      data: {
        status: FriendRequestStatus.Rejected,
      },
    });
    return `用户${id}已拒绝用户${friendId}的好友请求`;
  }

  async deleteFriend(friendId: number, id: number) {
    await this.prismaService.friendShip.deleteMany({
      where: {
        userId: id,
        friendId,
      },
    });
    return `用户${id}已删除用户${friendId}的好友关系`;
  }

  async getFriendShip(id: number) {
    const friends = await this.prismaService.friendShip.findMany({
      where: {
        // userId 或 friendId 为当前用户的记录
        OR: [
          {
            userId: id,
          },
          {
            friendId: id,
          },
        ],
      },
    });
    const set = new Set<number>();
    forEach(friends, (friend) => {
      set.add(friend.userId);
      set.add(friend.friendId);
    });
    // 去除自己
    const friendIds = filter(Array.from(set), (friendId) => friendId !== id);

    const res = [];

    // 这里用forEach不行，因为forEach不支持async
    for (const friendId of friendIds) {
      res.push(await this.userService.findUserById(friendId));
    }

    return res;
  }
}
