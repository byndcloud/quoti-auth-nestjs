import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { QuotiAuth } from 'quoti-auth';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private readonly quotiAuth: QuotiAuth) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();

    try {
      const userData = await this.quotiAuth.getUserData({
        token: `BearerStatic ${req.headers.bearerstatic}` as string,
        orgSlug: this.quotiAuth.orgSlug,
      });

      req.user = userData;
    } catch (error) {
      Logger.error(error);
      Logger.debug('Service account não autenticada');
      return false;
    }
    return true;
  }
}
