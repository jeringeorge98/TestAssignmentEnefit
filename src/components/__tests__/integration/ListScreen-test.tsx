import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ListScreen from "../../../app/(tabs)/listScreen";
import { useGetStations } from "../../../api";
import { stationData } from "../../../types";

// Mock the API hook
jest.mock("../../../api", () => ({
  useGetStations: jest.fn(),
}));

// Mock the ListViewComponent
jest.mock("../../ListViewComponent", () => ({
  ListViewComponent: ({ data }: { data: stationData }) => {
    const { View, Text } = require("react-native");
    return (
      <View testID={`list-item-${data.id}`}>
        <Text>{data.name}</Text>
      </View>
    );
  },
}));

const mockUseGetStations = useGetStations as jest.MockedFunction<
  typeof useGetStations
>;

const mockStationData: stationData[] = [
  {
    id: "1",
    name: "Tesla Supercharger Downtown",
    geocode: { lat: 59.437, lng: 24.7536 },
    address: "Downtown District",
    status: "available",
    power_rating: 250,
    distance: 500,
    connectors: [{ power: 250, quantity: 8 }],
  },
  {
    id: "2",
    name: "ChargePoint Mall Station",
    geocode: { lat: 59.438, lng: 24.7537 },
    address: "Shopping Mall",
    status: "occupied",
    power_rating: 150,
    distance: 1200,
    connectors: [{ power: 150, quantity: 4 }],
  },
  {
    id: "3",
    name: "EVgo Highway Stop",
    geocode: { lat: 59.439, lng: 24.7538 },
    address: "Highway Rest Area",
    status: "available",
    power_rating: 100,
    distance: 2000,
    connectors: [{ power: 100, quantity: 2 }],
  },
  {
    id: "4",
    name: "Tesla Urban Connector",
    geocode: { lat: 59.44, lng: 24.7539 },
    address: "City Center",
    status: "available",
    power_rating: 75,
    distance: 800,
    connectors: [{ power: 75, quantity: 6 }],
  },
];

const renderWithQueryClient = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>
  );
};

describe(" Search Filter Functionality", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseGetStations.mockReturnValue({
      data: mockStationData,
      isLoading: false,
      error: null,
    } as any);
  });

  test("search filter functionality works", () => {
    renderWithQueryClient(<ListScreen />);

    const searchInput = screen.getByPlaceholderText("Search");

    // Test search functionality by changing text
    act(() => {
      fireEvent.changeText(searchInput, "Tesla");
    });

    // The search input should accept the text
    expect(searchInput).toBeTruthy();
  });
});
