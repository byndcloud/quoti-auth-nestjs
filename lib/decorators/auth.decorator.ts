import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthenticationGuard } from '../guards/authentication.guard';
import {
  AuthorizationGuard,
  CustomPermission,
} from '../guards/authorization.guard';

export function Auth(permissions: string[][] | CustomPermission) {
  return applyDecorators(
    SetMetadata('permissions', permissions),
    UseGuards(AuthenticationGuard, AuthorizationGuard),
  );
}
