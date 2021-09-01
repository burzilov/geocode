import { Inject, Injectable } from '@nestjs/common';
import { OPTIONS } from './app.module';
import { GeocodeOptions } from './options.interface';

interface IGeocodeService {
  test(): Promise<any>;
}

@Injectable()
export class GeocodeService implements IGeocodeService {
  constructor(@Inject(OPTIONS) private options: GeocodeOptions) {}

  async test(): Promise<any> {
    return `Options: ${JSON.stringify(this.options)}`;
  }
}
