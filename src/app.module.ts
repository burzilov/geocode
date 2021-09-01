import { HttpModule } from '@nestjs/axios';
import { DynamicModule, Global, Module } from '@nestjs/common';
import { GeocodeOptions, OPTIONS } from './app.interfaces';
import { GeocodeService } from './app.service';

@Global()
@Module({
  imports: [HttpModule],
  exports: [GeocodeService],
  providers: [GeocodeService],
})
export class GeocodeModule {
  constructor(private service: GeocodeService) {}

  public register(options: GeocodeOptions): DynamicModule {
    this.service.init();
    return {
      module: GeocodeModule,
      providers: [{ provide: OPTIONS, useValue: options }],
    };
  }
}
