import { Module } from '@nestjs/common';

import { FriendShipService } from './friend-ship.service';
import { FriendShipController } from './friend-ship.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [FriendShipController],
  providers: [FriendShipService],
})
export class FriendShipModule {}
