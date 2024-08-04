import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { isArray, join } from 'lodash';

@Catch(HttpException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    response.statusCode = exception.getStatus(); // 设置状态码 此时其实已经是 400 了，但是response 里的可能是 201

    const res = exception.getResponse() as Record<string, any>;
    const messages: string[] = res?.message; // 针对 class-validator 的错误信息

    response
      .json({
        code: exception.getStatus(),
        message: 'fail',
        data: isArray(messages) ? join(messages, ',') : exception.message,
      })
      .end();
  }
}
