export const OPTIONS = 'OPTIONS';

export interface GeocodeOptions {
  google_api_key: string;
  geonames_username: string;
}

export interface Address {
  suggestion: string;
  country_iso: string;
  country: string;
  zip: string;
  city: string;
  street?: string;
  house?: string;
}
