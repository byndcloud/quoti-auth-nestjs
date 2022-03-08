import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { QuotiAuth } from 'quoti-auth';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private readonly quotiAuth: QuotiAuth) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();

    try {
      let token = req?.body?.token
      if (req.headers.bearerstatic) {
        token = `BearerStatic ${req.headers.bearerstatic}`
      }
      if (req.headers.authorization) {
        token = `${req.headers.authorization}`
      }
      if (!token) {
        throw new Error('Missing authentication')
      }

      const userData = await this.quotiAuth.getUserData({
        token,
        orgSlug: this.quotiAuth.orgSlug,
      });

      req.user = userData;
    } catch (error) {
      throw new UnauthorizedException({
        message: 'Invalid or missing Authorization, or BearerStatic header',
      });
    }
    return true;
  }
}
