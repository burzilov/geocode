import { Inject, Injectable } from '@nestjs/common';
// import { OPTIONS } from './app.module';
import { GeocodeOptions } from './options.interface';

@Injectable()
export class GeocodeService {
  constructor(@Inject('OPTIONS') private _options: GeocodeOptions) {}

  async test(): Promise<any> {
    return `Options: ${JSON.stringify(this._options)}`;
  }
}
