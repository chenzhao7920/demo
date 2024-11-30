  export type  Location = {
    id: number;
    street: string;
    zip_code: string;
    latitude: number;
    longitude: number;
    city_id: number;
    country_id: number;
    county_id: number;
    createdAt: Date;
    updatedAt: Date;
    timezone_id: number;
    score?: number;
  }
  export type LocationData = {
    street: string;
    city: string;
    zip_code: string;
    county: string;
    country: string;
    latitude: string;
    longitude: string;
    time_zone: string;
    score?: number;
  }