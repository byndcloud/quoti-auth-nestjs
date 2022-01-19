import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Logger } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as quotiPermissions from 'quoti-auth/src/permissions';
import { Request } from 'express';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const permissionsStringArrayOrFunction = this.reflector.get<
      string[][] | CustomPermission
    >('permissions', context.getHandler());
    const req = context.switchToHttp().getRequest<Request>();
    let permissions: string[][];
    if (!Array.isArray(permissionsStringArrayOrFunction)) {
      permissions = permissionsStringArrayOrFunction(req);
    } else {
      permissions = permissionsStringArrayOrFunction;
    }

    if (permissions.flat().length === 0) {
      Logger.debug('Any user can access this route');
      return true;
    }
    Logger.debug(`User must have role equals ${permissions}`);
    const hasPermission = quotiPermissions.validateSomePermissionCluster(
      Logger,
    )(permissions, req?.user, 'marketplace', false);

    if (hasPermission.length === 0) {
      throw new HttpException(
        {
          error: `Service account não possui permissão(ôes) ${permissions}`,
        },
        HttpStatus.FORBIDDEN,
      );
    }

    return true;
  }
}
export type CustomPermission = (req: Request) => string[][];
