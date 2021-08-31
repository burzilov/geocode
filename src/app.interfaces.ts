import { ModuleMetadata, Type } from '@nestjs/common';
import { GeocodeOptions } from './options.interface';

export interface GeocodeOptionsFactory {
  createGeocodeOptions(): Promise<GeocodeOptions> | GeocodeOptions;
}

export interface GeocodeAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useClass?: Type<GeocodeOptionsFactory>;
  useExisting?: Type<GeocodeOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<GeocodeOptions> | GeocodeOptions;
}
