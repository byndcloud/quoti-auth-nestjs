import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { quotiAuth } from 'quoti-auth';
import { AuthenticationGuard } from '../guards/authentication.guard';
import {
  AuthorizationGuard,
  CustomPermission,
} from '../guards/authorization.guard';

export function Auth(permissions: string[][] | CustomPermission) {
  return applyDecorators(
    SetMetadata('permissions', permissions),
    UseGuards(AuthenticationGuard, new AuthorizationGuard(new Reflector(), quotiAuth)),
  );
}
