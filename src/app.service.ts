import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { GeocodeOptions, OPTIONS } from './app.interfaces';

@Injectable()
export class GeocodeService {
  // Сервис для работы с адресами

  private countryName: any = {};

  constructor(
    @Inject(OPTIONS) private options: GeocodeOptions,
    private http: HttpService,
  ) {
    this.init();
  }

  init(): void {
    this.http
      .get(
        'http://api.geonames.org/countryInfoJSON?username=' +
          this.options.geonames_username,
      )
      .pipe(
        map((resp: any) => {
          (resp.data?.geonames as any[]).forEach((x) => {
            this.countryName[x.countryCode] = x.countryName;
          });
          console.log(this.countryName);
        }),
      )
      .subscribe();
  }

  test(): Observable<any> {
    return this.http
      .get(
        'http://api.geonames.org/countryInfoJSON?username=' +
          this.options.geonames_username,
      )
      .pipe(
        map((resp: any) => {
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
