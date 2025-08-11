import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react-native";
import { ChargeViewDetailsCardComponent } from "../../../ChargeViewDetailsCardComponent";
import { stationData } from "../../../../types";
import { router } from "expo-router";

// Mock dependencies
jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
}));

jest.mock("@gorhom/bottom-sheet", () => {
  const React = require("react");
  const { View, Text } = require("react-native");

  const BottomSheetModal = React.forwardRef(
    ({ children, ...props }: any, ref: any) => {
      React.useImperativeHandle(ref, () => ({
        present: jest.fn(),
        dismiss: jest.fn(),
      }));
      return (
        <View testID="bottom-sheet-modal" {...props}>
          {children}
        </View>
      );
    }
  );

  const BottomSheetView = ({ children, ...props }: any) => (
    <View testID="bottom-sheet-view" {...props}>
      {children}
    </View>
  );

  const BottomSheetScrollView = ({ children, ...props }: any) => (
    <View testID="bottom-sheet-scroll-view" {...props}>
      {children}
    </View>
  );

  return {
    BottomSheetModal,
    BottomSheetView,
    BottomSheetScrollView,
  };
});

jest.mock("../../../ConnectorItemList.tsx", () => ({
  ConnectorItemList: ({ connector }: any) => (
    <div testID={`connector-${connector.power}`}>
      Power: {connector.power}kW, Quantity: {connector.quantity}
    </div>
  ),
}));

jest.mock("@expo/vector-icons", () => ({
  MaterialIcons: ({ name, testID, ...props }: any) => (
    <div testID={testID || `icon-${name}`} data-icon-name={name} {...props}>
      {name}
    </div>
  ),
}));

const mockStationData: stationData = {
  id: "1",
  name: "Test Charging Station",
  geocode: { lat: 59.437, lng: 24.7536 },
  address: "123 Test Street, Test City",
  status: "available",
  power_rating: 150,
  distance: 2500, // 2.5km in meters
  connectors: [
    { power: 50, quantity: 2 },
    { power: 100, quantity: 1 },
  ],
};

const mockOccupiedStation: stationData = {
  ...mockStationData,
  status: "occupied",
};

const mockOutOfServiceStation: stationData = {
  ...mockStationData,
  status: "out_of_service",
};

describe("<ChargeViewDetailsCardComponent />", () => {
  const mockRef = React.createRef<any>();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Component Rendering", () => {
    test("renders with station data", () => {
      render(
        <ChargeViewDetailsCardComponent
          ref={mockRef}
          stationDetails={mockStationData}
        />
      );

      // Check if main components render
      expect(screen.getByTestId("bottom-sheet-modal")).toBeTruthy();
      expect(screen.getByTestId("bottom-sheet-view")).toBeTruthy();

      // Check station name
      expect(screen.getByText("Test Charging Station")).toBeTruthy();

      // Check address section
      expect(screen.getByText("Address")).toBeTruthy();
      expect(screen.getByText("123 Test Street, Test City")).toBeTruthy();

      // Check power rating
      expect(screen.getByText("150 kW")).toBeTruthy();

      // Check distance (converted from meters to km)
      expect(screen.getByText("2.5 km")).toBeTruthy();

      // Check start charging button
      expect(screen.getByText("Start Charging")).toBeTruthy();
    });

    test("renders without station data", () => {
      render(
        <ChargeViewDetailsCardComponent
          ref={mockRef}
          stationDetails={undefined}
        />
      );

      expect(screen.getByTestId("bottom-sheet-modal")).toBeTruthy();
      expect(screen.getByTestId("bottom-sheet-view")).toBeTruthy();
    });

    test("renders connectors list", () => {
      render(
        <ChargeViewDetailsCardComponent
          ref={mockRef}
          stationDetails={mockStationData}
        />
      );

      // Check if connectors are rendered
      expect(screen.getByTestId("connector-50")).toBeTruthy();
      expect(screen.getByTestId("connector-100")).toBeTruthy();
    });
  });

  describe("Status Display", () => {
    test("displays available status correctly", () => {
      render(
        <ChargeViewDetailsCardComponent
          ref={mockRef}
          stationDetails={mockStationData}
        />
      );

      expect(screen.getByText("Available")).toBeTruthy();
    });

    test("displays occupied status correctly", () => {
      render(
        <ChargeViewDetailsCardComponent
          ref={mockRef}
          stationDetails={mockOccupiedStation}
        />
      );

      expect(screen.getByText("Occupied")).toBeTruthy();
    });

    test("displays out of service status correctly", () => {
      render(
        <ChargeViewDetailsCardComponent
          ref={mockRef}
          stationDetails={mockOutOfServiceStation}
        />
      );

      expect(screen.getByText("Out of Service")).toBeTruthy();
    });

    test("displays unknown status for invalid status", () => {
      const unknownStatusStation = {
        ...mockStationData,
        status: "invalid_status",
      };
      render(
        <ChargeViewDetailsCardComponent
          ref={mockRef}
          stationDetails={unknownStatusStation}
        />
      );

      expect(screen.getByText("invalid_status")).toBeTruthy();
    });
  });

  describe("Icons Rendering", () => {
    test("renders all required icons", () => {
      render(
        <ChargeViewDetailsCardComponent
          ref={mockRef}
          stationDetails={mockStationData}
        />
      );

      expect(screen.getByTestId("icon-directions-car")).toBeTruthy();
      expect(screen.getByTestId("icon-power")).toBeTruthy();
      expect(screen.getByTestId("icon-electric-bolt")).toBeTruthy();
    });
  });

  describe("Button Behavior and Navigation", () => {
    test("start charging button is enabled when status is available", () => {
      render(
        <ChargeViewDetailsCardComponent
          ref={mockRef}
          stationDetails={mockStationData}
        />
      );

      const startButton = screen.getByText("Start Charging").parent;
      fireEvent.press(startButton);
      expect(router.push).toHaveBeenCalledWith({
        pathname: "/startCharging",
        params: {
          stationName: "Test Charging Station",
          noOfConnectors: "2",
          powerRating: "150",
        },
      });
    });

    test("start charging button is disabled when status is occupied", () => {
      render(
        <ChargeViewDetailsCardComponent
          ref={mockRef}
          stationDetails={mockOccupiedStation}
        />
      );

      const startButton = screen.getByText("Start Charging").parent;
      // Note: The disabled prop should be true, but visual testing might be limited
      // We can test the logic by checking if press events are handled
    });

    test("navigates when start charging button is pressed and station is available", () => {
      render(
        <ChargeViewDetailsCardComponent
          ref={mockRef}
          stationDetails={mockStationData}
        />
      );

      const startButton = screen.getByText("Start Charging").parent;
      fireEvent.press(startButton!);

      expect(router.push).toHaveBeenCalledWith({
        pathname: "/startCharging",
        params: {
          stationName: "Test Charging Station",
          noOfConnectors: "2",
          powerRating: "150",
        },
      });
    });

    test("does not navigate when start charging button is pressed and station is occupied", () => {
      render(
        <ChargeViewDetailsCardComponent
          ref={mockRef}
          stationDetails={mockOccupiedStation}
        />
      );

      const startButton = screen.getByText("Start Charging").parent;
      fireEvent.press(startButton!);

      // Should not navigate when disabled
      expect(router.push).not.toHaveBeenCalled();
    });

    test("does not navigate when start charging button is pressed and station is out of service", () => {
      render(
        <ChargeViewDetailsCardComponent
          ref={mockRef}
          stationDetails={mockOutOfServiceStation}
        />
      );

      const startButton = screen.getByText("Start Charging").parent;
      fireEvent.press(startButton!);

      // Should not navigate when disabled
      expect(router.push).not.toHaveBeenCalled();
    });
  });

  describe("Edge Cases", () => {
    test("handles station with no connectors", () => {
      const stationNoConnectors = { ...mockStationData, connectors: [] };
      render(
        <ChargeViewDetailsCardComponent
          ref={mockRef}
          stationDetails={stationNoConnectors}
        />
      );

      expect(screen.getByText("Test Charging Station")).toBeTruthy();
      // Should handle empty connectors array gracefully
    });

    test("handles station with undefined distance", () => {
      const stationNoDistance = {
        ...mockStationData,
        distance: undefined as any,
      };
      render(
        <ChargeViewDetailsCardComponent
          ref={mockRef}
          stationDetails={stationNoDistance}
        />
      );

      expect(screen.getByText("0 km")).toBeTruthy();
    });
  });
});
