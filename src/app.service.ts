import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { GeocodeOptions, OPTIONS } from './app.interfaces';

@Injectable()
export class GeocodeService {
  constructor(
    @Inject(OPTIONS) private options: GeocodeOptions,
    private http: HttpService,
  ) {}

  test(): Observable<any> {
    return this.http
      .get(
        'http://api.geonames.org/countryInfoJSON?username=' +
          this.options.geonames_username,
      )
      .pipe(
        map((resp: any) => {
          console.log(resp.data?.geonames);

          const countryName = {};
          (resp.data?.geonames as any[]).forEach((x) => {
            countryName[x.countryCode] = x.countryName;
          });
          return countryName;
        }),
      );
    // return `Options: ${JSON.stringify(this.options)}`;
  }
}
