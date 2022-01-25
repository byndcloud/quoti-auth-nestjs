import { DynamicModule, Global, Module } from '@nestjs/common';
import { QuotiAuth, quotiAuth, SetupConfig } from 'quoti-auth';

@Global()
@Module({})
export class QuotiAuthModule {
  static register(quotiAuthSetupConfig: SetupConfig): DynamicModule {
    quotiAuth.setup(quotiAuthSetupConfig)
    return {
      module: QuotiAuthModule,
      providers: [
        {
          provide: QuotiAuth,
          useValue: quotiAuth,
        },
      ],
      exports: [
        {
          provide: QuotiAuth,
          useValue: quotiAuth,
        },
      ],
    };
  }
}
