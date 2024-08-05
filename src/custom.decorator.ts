import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { isEmpty } from 'lodash';
import { Request } from 'express';

export const UserInfo = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>();

    if (isEmpty(request.user)) return null;
    return data ? request.user[data] : request.user;
  },
);
