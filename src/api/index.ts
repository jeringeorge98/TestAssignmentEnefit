import { useQuery } from "@tanstack/react-query";
import { stationData } from "../types";
import axios from "axios";
const BASE_URL = "http://172.31.144.24:3000";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const useGetStations = () => {
  return useQuery({
    queryKey: ["stations"],
    queryFn: () => getStations(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: true,
  });
};

const getStations = async (): Promise<stationData[]> => {
  try {
    console.log("Making request to:", `${BASE_URL}/stations`);
    const response = await apiClient.get("/stations");

    console.log("Response", response.status);
    console.log("Response data", response.data);
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error fetching stations", error);
    throw error;
  }
};
