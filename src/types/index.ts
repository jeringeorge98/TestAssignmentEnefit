export type stationData = {
  id: string;
  name: string;
  geocode: {
    lat: number;
    lng: number;
  };
  address: string;
  status: string;
  power_rating: number;
};
