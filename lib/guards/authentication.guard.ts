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
      const userData = await this.quotiAuth.getUserData({
        token: `BearerStatic ${req.headers.bearerstatic}` as string,
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
