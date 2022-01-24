import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import axios from 'axios';
import { Agent } from 'https';

import { quotiAuth } from 'quoti-auth';

import { Request } from 'express';

import { Logger } from '@nestjs/common';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    const apiKey = process.env.QUOTI_AUTH_API_KEY;

    let getUserData;
    if (process.env.QUOTI_URL_DEV) {
      getUserData = async ({
        token,
        orgSlug,
      }: {
        token: string;
        orgSlug: string;
      }) => {
        const url = process.env.QUOTI_URL_DEV;
        const headers = {
          ApiKey: apiKey,
        };
        // workaround for localhost-https: ignore ssl certificate
        const httpAgent = new Agent({
          rejectUnauthorized: false,
        });

        const { data } = await axios.post(
          `${url}${orgSlug}/auth/login/getuser`,
          { token },
          { headers, httpsAgent: httpAgent },
        );
        return data;
      };
    }

    await quotiAuth.setup({
      orgSlug: 'marketplace',
      apiKey,
      logger: console,
      getUserData,
    });
    let userData;
    try {
      userData = await quotiAuth.getUserData({
        token: `BearerStatic ${req.headers.bearerstatic}` as string,
        orgSlug: 'marketplace',
      });
    } catch (error) {
      Logger.error(error);
      Logger.debug('Service account não autenticada');
      throw new HttpException(
        {
          error: 'Service account não autenticada',
        },
        HttpStatus.FORBIDDEN,
      );
    }
    req.user = userData;
    return true;
  }
}
