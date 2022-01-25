import { DynamicModule, Global, Module } from '@nestjs/common';
import { QuotiAuth, SetupConfig } from 'quoti-auth';

@Global()
@Module({})
export class QuotiAuthModule {
  static register(quotiAuthSetupConfig: SetupConfig): DynamicModule {
    const qtAuth = new QuotiAuth();
    qtAuth.setup(quotiAuthSetupConfig)
    return {
      module: QuotiAuthModule,
      providers: [
        {
          provide: QuotiAuth,
          useValue: qtAuth,
        },
      ],
      exports: [
        {
          provide: QuotiAuth,
          useValue: qtAuth,
        },
      ],
    };
  }
}
