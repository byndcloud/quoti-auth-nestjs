import { DynamicModule, Module } from '@nestjs/common';
import { SetupConfig } from 'quoti-auth';
// TODO: Return Quoti Auth Provider
@Module({})
export class QuotiAuthModule {
  static register(quotiAuthSetupConfig: SetupConfig): DynamicModule {
    return {};
  }
}
