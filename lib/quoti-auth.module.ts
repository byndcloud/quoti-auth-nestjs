import { DynamicModule, Global, Module } from '@nestjs/common';
import { QuotiAuth, quotiAuth, SetupConfig } from 'quoti-auth';

@Global()
@Module({})
export class QuotiAuthModule {
  static register(quotiAuthSetupConfig: SetupConfig): DynamicModule {
    quotiAuth.setup(quotiAuthSetupConfig);
    const quotiAuthProvider = {
      provide: QuotiAuth,
      useValue: quotiAuth,
    };
    return {
      module: QuotiAuthModule,
      providers: [quotiAuthProvider],
      exports: [quotiAuthProvider],
    };
  }
}
