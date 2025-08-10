import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { ChargingSessions, stationData } from "../types";
import axios from "axios";
import { SpotPrice, SpotPricingService } from "../service/spotPricingService";
const BASE_URL = "http://localhost:3000";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const queryClient = new QueryClient();
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

export const startChargeSession = async (body: ChargingSessions) => {
  try {
    const response = await apiClient.post("/charging_sessions", body);
    return response.data;
  } catch (error) {
    console.error("Error starting charge session", error);
    throw error;
  }
};

export const useStartChargeSession = () => {
  return useMutation({
    mutationFn: (body: ChargingSessions) => startChargeSession(body),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["charging_sessions"] });
    },
    onError: (error) => {
      console.error("Error starting charge session", error);
    },
  });
};

// Update the charging session

export const updateChargeSession = async (body: ChargingSessions) => {
  try {
    const prevData = await apiClient.get(`/charging_sessions/${body.id}`);
    const end_time = body.end_time;
    const status = body.status;

    const response = await apiClient.put(
      `/charging_sessions/${body.id}`,

      {
        ...prevData.data,
        end_time,
        status,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating charge session", error);
    throw error;
  }
};

export const useUpdateChargeSession = () => {
  return useMutation({
    mutationFn: (body: ChargingSessions) => updateChargeSession(body),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["charging_sessions"] });
    },
    onError: (error) => {
      console.error("Error updating charge session", error);
    },
  });
};

// export const startChargeSession = async

export const getChargingSessions = async (): Promise<ChargingSessions[]> => {
  try {
    const response = await apiClient.get("/charging_sessions");
    return response.data;
  } catch (error) {
    console.error("Error fetching charging sessions", error);
    throw error;
  }
};

export const useGetChargingSessions = () => {
  return useQuery({
    queryKey: ["charging_sessions"],
    queryFn: () => getChargingSessions(),
    staleTime: 1000 * 60 * 1, // 1 minute
    enabled: true,
  });
};
