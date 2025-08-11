import React from "react";
import { render, screen } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MapsScreen from "../../../app/(tabs)/index";
import { useGetStations } from "../../../api";
import { stationData } from "../../../types";

// Mock the API hook
jest.mock("../../../api", () => ({
  useGetStations: jest.fn(),
}));

// Mock the MapComponent
jest.mock("../../MapComponent", () => {
  return function MockMapComponent({ markers }: { markers: stationData[] }) {
    const { View, Text } = require("react-native");
    return (
      <View testID="map-component">
        <Text testID="markers-count">Markers: {markers?.length || 0}</Text>
        {markers?.map((marker) => (
          <Text key={marker.id} testID={`marker-${marker.id}`}>
            {marker.name}
          </Text>
        ))}
      </View>
    );
  };
});

const mockUseGetStations = useGetStations as jest.MockedFunction<
  typeof useGetStations
>;

const mockStationData: stationData[] = [
  {
    id: "1",
    name: "Test Station 1",
    geocode: { lat: 59.437, lng: 24.7536 },
    address: "Test Address 1",
    status: "available",
    power_rating: 50,
    distance: 1200,
    connectors: [{ power: 50, quantity: 2 }],
  },
  {
    id: "2",
    name: "Test Station 2",
    geocode: { lat: 59.438, lng: 24.7537 },
    address: "Test Address 2",
    status: "occupied",
    power_rating: 100,
    distance: 2100,
    connectors: [{ power: 100, quantity: 1 }],
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

describe("<MapsScreen />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Loading State", () => {
    test("displays loading indicator when data is loading", () => {
      mockUseGetStations.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
      } as any);

      renderWithQueryClient(<MapsScreen />);

      // Should display the loading indicator
      expect(screen.getByTestId("activity-indicator")).toBeTruthy();

      // Should NOT display map or error message
      expect(screen.queryByTestId("map-component")).toBeNull();
      expect(
        screen.queryByText("No Data Found or Error fetching data")
      ).toBeNull();
    });
  });

  describe("Error State", () => {
    test("displays error message when API call fails", () => {
      mockUseGetStations.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error("Network error"),
      } as any);

      renderWithQueryClient(<MapsScreen />);

      // Should display error message
      expect(
        screen.getByText("No Data Found or Error fetching data")
      ).toBeTruthy();

      // Should NOT display loading indicator or map
      expect(screen.queryByTestId("activity-indicator")).toBeNull();
      expect(screen.queryByTestId("map-component")).toBeNull();
    });

    test("displays error message when no data is returned", () => {
      mockUseGetStations.mockReturnValue({
        data: null,
        isLoading: false,
        error: null,
      } as any);

      renderWithQueryClient(<MapsScreen />);

      // Should display error message for null data
      expect(
        screen.getByText("No Data Found or Error fetching data")
      ).toBeTruthy();

      // Should NOT display loading indicator or map
      expect(screen.queryByTestId("activity-indicator")).toBeNull();
      expect(screen.queryByTestId("map-component")).toBeNull();
    });

    test("displays error message when empty data is returned", () => {
      mockUseGetStations.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: null,
      } as any);

      renderWithQueryClient(<MapsScreen />);

      // Should display error message for undefined data
      expect(
        screen.getByText("No Data Found or Error fetching data")
      ).toBeTruthy();

      // Should NOT display loading indicator or map
      expect(screen.queryByTestId("activity-indicator")).toBeNull();
      expect(screen.queryByTestId("map-component")).toBeNull();
    });
  });

  describe("Success State", () => {
    test("displays MapComponent when data is successfully loaded", () => {
      mockUseGetStations.mockReturnValue({
        data: mockStationData,
        isLoading: false,
        error: null,
      } as any);

      renderWithQueryClient(<MapsScreen />);

      // Should display the map component
      expect(screen.getByTestId("map-component")).toBeTruthy();

      // Should display correct number of markers
      expect(screen.getByText("Markers: 2")).toBeTruthy();

      // Should display station names
      expect(screen.getByText("Test Station 1")).toBeTruthy();
      expect(screen.getByText("Test Station 2")).toBeTruthy();

      // Should NOT display loading indicator or error message
      expect(screen.queryByTestId("activity-indicator")).toBeNull();
      expect(
        screen.queryByText("No Data Found or Error fetching data")
      ).toBeNull();
    });

    test("displays MapComponent with empty markers array", () => {
      mockUseGetStations.mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
      } as any);

      renderWithQueryClient(<MapsScreen />);

      // Should display the map component with no markers
      expect(screen.getByTestId("map-component")).toBeTruthy();
      expect(screen.getByText("Markers: 0")).toBeTruthy();

      // Should NOT display loading indicator or error message
      expect(screen.queryByTestId("activity-indicator")).toBeNull();
      expect(
        screen.queryByText("No Data Found or Error fetching data")
      ).toBeNull();
    });

    test("passes station data correctly to MapComponent", () => {
      const customStationData: stationData[] = [
        {
          id: "3",
          name: "Custom Station",
          geocode: { lat: 60.0, lng: 25.0 },
          address: "Custom Address",
          status: "available",
          power_rating: 150,
          distance: 500,
          connectors: [{ power: 150, quantity: 1 }],
        },
      ];

      mockUseGetStations.mockReturnValue({
        data: customStationData,
        isLoading: false,
        error: null,
      } as any);

      renderWithQueryClient(<MapsScreen />);

      // Should display the custom station
      expect(screen.getByTestId("map-component")).toBeTruthy();
      expect(screen.getByText("Markers: 1")).toBeTruthy();
      expect(screen.getByText("Custom Station")).toBeTruthy();
    });
  });

  describe("Component Structure", () => {
    test("renders error view with proper styling", () => {
      mockUseGetStations.mockReturnValue({
        data: null,
        isLoading: false,
        error: null,
      } as any);

      renderWithQueryClient(<MapsScreen />);

      // Error view should be centered and display the error message
      const errorText = screen.getByText(
        "No Data Found or Error fetching data"
      );
      expect(errorText).toBeTruthy();
    });
  });
});
