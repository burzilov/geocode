import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { map, Observable, of } from 'rxjs';
import { Address, GeocodeOptions, OPTIONS } from './app.interfaces';

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
        }),
      )
      .subscribe();
  }

  countries(): Observable<any> {
    return of(this.countryName);
  }

  cityByZipGeonamesOrg(query: string): Observable<Address[]> {
    // поиск стран и городов по почтовому индексу с помощью Geonames.Org

    if (!query) {
      return of([]);
    }

    const url =
      'http://api.geonames.org/postalCodeLookupJSON?username=' +
      process.env.GeonamesOrgUsername +
      '&postalcode=' +
      encodeURIComponent(query);

    console.log(url);

    return this.http.get(url).pipe(
      map((resp: any) => {
        const data: Address[] = resp.data?.postalcodes
          ?.map((x: any) => {
            const address: Address = {
              suggestion: [
                this.countryName[x.countryCode],
                x.postalcode,
                x.placeName,
              ].join(', '),
              country_iso: x.countryCode,
              country: this.countryName[x.countryCode],
              zip: x.postalcode,
              city: x.placeName,
            };
            return address;
          })
          .sort((a: any, b: any) => {
            const _a = a.country + a.city;
            const _b = b.country + b.city;
            return _a > _b ? 1 : -1;
          });
        return data;
      }),
    );
  }
}
