import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { ListViewComponent } from "../../../ListViewComponent";
import { stationData } from "../../../../types";
import { router } from "expo-router";

// Mock expo-router
jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
}));

const mockStationData: stationData = {
  id: "1",
  name: "Test Charging Station",
  geocode: { lat: 59.437, lng: 24.7536 },
  address: "123 Main Street, Test City, TC 12345",
  status: "available",
  power_rating: 150,
  distance: 2500,
  connectors: [
    { power: 50, quantity: 2 },
    { power: 100, quantity: 1 },
  ],
};

describe("<ListViewComponent />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Component Structure", () => {
    test("renders basic list item structure", () => {
      render(<ListViewComponent data={mockStationData} />);

      // Check if main container is pressable
      expect(screen.getByTestId("list-item-pressable")).toBeTruthy();

      // Check if station name is displayed
      expect(screen.getByText("Test Charging Station")).toBeTruthy();

      // Check if status is displayed
      expect(screen.getByText("available")).toBeTruthy();

      // Check if address is displayed
      expect(
        screen.getByText("123 Main Street, Test City, TC 12345")
      ).toBeTruthy();

      // Check if power rating is displayed
      expect(screen.getByText("150 kWh")).toBeTruthy();
    });

    test("displays all required station information", () => {
      render(<ListViewComponent data={mockStationData} />);

      // Verify all key information is present
      expect(screen.getByText(mockStationData.name)).toBeTruthy();
      expect(screen.getByText(mockStationData.status)).toBeTruthy();
      expect(screen.getByText(mockStationData.address)).toBeTruthy();
      expect(
        screen.getByText(`${mockStationData.power_rating} kWh`)
      ).toBeTruthy();
    });
  });

  describe("Navigation Functionality", () => {
    test("navigates to startCharging screen when pressed", () => {
      render(<ListViewComponent data={mockStationData} />);

      // Press the list item
      const listItem = screen.getByTestId("list-item-pressable");
      fireEvent.press(listItem);

      // Verify navigation occurred with correct parameters
      expect(router.push).toHaveBeenCalledTimes(1);
      expect(router.push).toHaveBeenCalledWith({
        pathname: "/startCharging",
        params: {
          stationName: "Test Charging Station",
          noOfConnectors: "2", // 2 connectors in mock data
          powerRating: "150",
        },
      });
    });
  });
});
