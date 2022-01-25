import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as quotiPermissions from 'quoti-auth/src/permissions';
import { Request } from 'express';
import { QuotiAuth } from 'quoti-auth';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly quotiAuth: QuotiAuth,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const permissionsStringArrayOrFunction = this.reflector.get<
      string[][] | CustomPermission
    >('permissions', context.getHandler());
    const req = context.switchToHttp().getRequest<Request>();

    const permissions = Array.isArray(permissionsStringArrayOrFunction)
      ? permissionsStringArrayOrFunction
      : permissionsStringArrayOrFunction(req);

    if (permissions.flat().length === 0) {
      Logger.debug('Any user can access this route');
      return true;
    }

    const hasPermission = quotiPermissions.validateSomePermissionCluster(
      Logger,
    )(permissions, req?.user, this.quotiAuth.orgSlug, false);

    if (hasPermission.length === 0) {
      const simplifiedPermissions = req.user.Permissions.map((p) => p.name);
      Logger.debug(
        'Service account não autorizada, permissões necessárias: \n',
        permissions,
        '\nPermissões que o usuário tem:',
        simplifiedPermissions,
      );
      return false;
    }

    return true;
  }
}
export type CustomPermission = (req: Request) => string[][];
