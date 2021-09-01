import { DynamicModule, Global, Module } from '@nestjs/common';
import { GeocodeOptions, OPTIONS } from './app.interfaces';
import { GeocodeService } from './app.service';

@Global()
@Module({
  providers: [GeocodeService],
  exports: [GeocodeService],
})
export class GeocodeModule {
  public static register(options: GeocodeOptions): DynamicModule {
    return {
      module: GeocodeModule,
      providers: [{ provide: OPTIONS, useValue: options }],
    };
  }
}
