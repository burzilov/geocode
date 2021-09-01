import { Inject, Injectable } from '@nestjs/common';
import { GeocodeOptions, OPTIONS } from './app.interfaces';

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
