import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
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
      this.options.geonames_username +
      '&postalcode=' +
      encodeURIComponent(query);

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

  cityByZipGoogleCom(query: string): Observable<Address[]> {
    // поиск стран и городов по почтовому индексу с помощью Google Maps

    if (!query) {
      return of([]);
    }

    const url =
      'https://maps.googleapis.com/maps/api/place/autocomplete/json?language=en&key=' +
      this.options.google_api_key +
      '&input=' +
      encodeURIComponent(query);

    return this.http.get(url).pipe(
      map((resp: any) => {
        return resp.data.predictions
          .map((x: any) => {
            return {
              place_id: x.place_id,
              types: x.types,
              url:
                'https://maps.googleapis.com/maps/api/place/details/json?language=en&key=' +
                this.options.google_api_key +
                '&place_id=' +
                x.place_id,
            };
          })
          .filter((x: any) => (x.types as any[]).includes('postal_code'))
          .map((x: any) => {
            return this.http.get(x.url);
          });
      }),

      switchMap((x) => forkJoin(x)),

      map((resp: any[]) => {
        return resp.map((x: any) => {
          const components = x.data.result.address_components;
          const address = {} as Address;
          components.forEach((x: any) => {
            const t = x.types as string[];
            if (t.includes('postal_code')) {
              address.zip = x.long_name;
            }
            if (t.includes('country')) {
              address.country_iso = x.short_name;
              address.country = x.long_name;
            }
            if (t.includes('locality')) {
              address.city = x.long_name;
            }
            if (t.includes('administrative_area_level_3') && !address.city) {
              address.city = x.long_name;
            }
            if (t.includes('administrative_area_level_2') && !address.city) {
              address.city = x.long_name;
            }
            if (t.includes('administrative_area_level_1') && !address.city) {
              address.city = x.long_name;
            }
          });
          if (address.city === '') {
            address.city = address.country;
          }
          address.suggestion = [
            address.country,
            address.zip,
            address.city,
          ].join(', ');
          return address;
        });
      }),
    );
  }
}
