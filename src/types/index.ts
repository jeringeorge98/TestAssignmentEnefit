// src/types/index.ts
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
  distance: number;
  connectors: Connector[];
};
export type SpotPrice = {
  rate: number;
  curreny: string;
  lastUpdated: string;
};
export type Connector = {
  power: number;
  quantity: number;
};

export type ChargingSessions = {
  id: string;
  station_id?: string;
  start_time?: string;
  end_time?: string;
  charge_rate?: number;
  total_cost?: number;
  status: "ACTIVE" | "COMPLETED";
};
