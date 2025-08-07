export type stationData = {
  id: string;
  name: string;
  geocode: {
    lat: number;
    lng: number;
  };
  status: string;
  power_rating: number;
};
