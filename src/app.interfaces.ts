export const OPTIONS = 'OPTIONS';

export interface GeocodeOptions {
  google_api_key: string;
  geonames_username: string;
}

// export interface GeocodeOptionsFactory {
//   createGeocodeOptions(): Promise<GeocodeOptions> | GeocodeOptions;
// }

// export interface GeocodeAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
//   inject?: any[];
//   useClass?: Type<GeocodeOptionsFactory>;
//   useExisting?: Type<GeocodeOptionsFactory>;
//   useFactory?: (...args: any[]) => Promise<GeocodeOptions> | GeocodeOptions;
// }
