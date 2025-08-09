import { useQuery } from "@tanstack/react-query";
import { stationData } from "../types";
import axios from "axios";
import { SpotPrice, SpotPricingService } from "../service/spotPricingService";
const BASE_URL = "http://localhost:3000";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Api TO GET STATIONS

export const useGetStations = () => {
  return useQuery({
    queryKey: ["stations"],
    queryFn: () => getStations(),
    staleTime: 1000 * 60 * 1, // 1 minute
    enabled: true,
  });
};

const getStations = async (): Promise<stationData[]> => {
  try {
    console.log("Making request to:", `${BASE_URL}/stations`);
    const response = await apiClient.get("/stations");

    // console.log("Response", response.status);
    // console.log("Response data", response.data);
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error fetching stations", error);
    throw error;
  }
};

// Api to get spot pricing
export const useGetSpotPrice = () => {
  return useQuery({
    queryKey: ["spot-price"],
    queryFn: () => SpotPricingService.getSpotPrice(),
    staleTime: 1000 * 60 * 5, // Every 5 minutes
    enabled: true,
  });
};

// Post to create a new session

// export const startChargeSession = async
