import { DynamicModule, Global, Module } from '@nestjs/common';
import { GeocodeService } from './app.service';
import { GeocodeOptions } from './options.interface';

export const OPTIONS = 'OPTIONS';

@Global()
@Module({
  exports: [GeocodeService],
  providers: [GeocodeService],
})
export class GeocodeModule {
  public static register(options: GeocodeOptions): DynamicModule {
    return {
      module: GeocodeModule,
      exports: [GeocodeService],
      providers: [
        GeocodeService,
        {
          provide: OPTIONS,
          useValue: options,
        },
      ],
    };
  }
}
