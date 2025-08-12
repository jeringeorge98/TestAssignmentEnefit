import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react-native";
import StartCharging from "../../../app/startCharging";
import { router } from "expo-router";
import { useGetSpotPrice, useStartChargeSession } from "../../../api";

// Mock dependencies
jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
  useLocalSearchParams: jest.fn(),
  useRouter: jest.fn(),
}));

jest.mock("../../../api", () => ({
  useGetSpotPrice: jest.fn(),
  useStartChargeSession: jest.fn(),
  useUpdateChargeSession: jest.fn(),
}));

jest.mock("@expo/vector-icons", () => ({
  MaterialIcons: ({ name, testID, ...props }: any) => {
    const { View, Text } = require("react-native");
    return (
      <View testID={testID || `icon-${name}`} {...props}>
        <Text>{name}</Text>
      </View>
    );
  },
}));

jest.mock("../../Button", () => {
  return function MockButton({ onPress, title, icon, testID, ...props }: any) {
    const { TouchableOpacity, Text, View } = require("react-native");
    return (
      <TouchableOpacity
        testID={testID || "mock-button"}
        onPress={onPress}
        {...props}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {icon}
          <Text>{title}</Text>
        </View>
      </TouchableOpacity>
    );
  };
});

const mockUseLocalSearchParams = require("expo-router").useLocalSearchParams;
const mockUseGetSpotPrice = useGetSpotPrice as jest.MockedFunction<
  typeof useGetSpotPrice
>;
const mockUseStartChargeSession = useStartChargeSession as jest.MockedFunction<
  typeof useStartChargeSession
>;

const mockSearchParams = {
  stationName: "Tesla Supercharger",
  noOfConnectors: "3",
  powerRating: "150",
};

const mockSpotPriceData = {
  rate: 0.25,
  curreny: "EUR",
  lastUpdated: "2025-01-01T10:00:00Z",
};

const mockStartSessionMutation = {
  mutateAsync: jest.fn(),
  isLoading: false,
  error: null,
};

describe("<StartCharging />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLocalSearchParams.mockReturnValue(mockSearchParams);
    mockUseGetSpotPrice.mockReturnValue({
      data: mockSpotPriceData,
      isLoading: false,
      error: null,
    });
    mockUseStartChargeSession.mockReturnValue(mockStartSessionMutation);

    // Mock Math.random for consistent sessionId in tests
    jest.spyOn(Math, "random").mockReturnValue(0.123456789);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Parameter Display", () => {
    test("displays all passed parameters correctly", () => {
      render(<StartCharging />);

      // Check station name display
      expect(screen.getByText("Tesla Supercharger Station")).toBeTruthy();

      // Check number of connectors display
      expect(screen.getByText("3 Connectors Available")).toBeTruthy();

      // Check power rating display
      expect(screen.getByText("150 kW max")).toBeTruthy();

      // Check section headers
      expect(screen.getByText("Maximum Power Rating")).toBeTruthy();
      expect(screen.getByText("Charging Fees")).toBeTruthy();
      expect(screen.getByText("Choose A Connector")).toBeTruthy();
    });
  });

  describe("Spot Price API Integration", () => {
    test("displays spot price data when API succeeds", () => {
      render(<StartCharging />);

      // Check spot price display
      expect(screen.getByText("0.25 EUR/kWh")).toBeTruthy();
    });

    test("handles spot price API error", () => {
      mockUseGetSpotPrice.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error("Network error"),
      });

      render(<StartCharging />);

      // Component should still render without crashing on error
      expect(screen.getByText("Tesla Supercharger Station")).toBeTruthy();
    });
  });

  describe("Connector Selection", () => {
    test("renders correct number of connectors based on noOfConnectors parameter", () => {
      render(<StartCharging />);

      // Should render 3 connectors as per mockSearchParams
      expect(screen.getByText("Connecter 1")).toBeTruthy();
      expect(screen.getByText("Connecter 2")).toBeTruthy();
      expect(screen.getByText("Connecter 3")).toBeTruthy();
    });

    test("connector selection updates state correctly", () => {
      render(<StartCharging />);

      const connector1 = screen.getByText("Connecter 1").parent;
      const connector2 = screen.getByText("Connecter 2").parent;

      // Initially no connectors should be selected
      // We can verify this by checking the TouchableOpacity elements
      expect(connector1).toBeTruthy();
      expect(connector2).toBeTruthy();

      // Select connector 1
      fireEvent.press(connector1!);

      // The component should re-render with updated state
      // (Visual changes are handled by the component's styling logic)
      expect(screen.getByText("Connecter 1")).toBeTruthy();

      // Select connector 2 (should deselect connector 1 due to toggle behavior)
      fireEvent.press(connector2!);
      expect(screen.getByText("Connecter 2")).toBeTruthy();
    });

    test("handles different numbers of connectors", () => {
      const paramsWithTwoConnectors = {
        ...mockSearchParams,
        noOfConnectors: "2",
      };
      mockUseLocalSearchParams.mockReturnValue(paramsWithTwoConnectors);

      render(<StartCharging />);

      expect(screen.getByText("Connecter 1")).toBeTruthy();
      expect(screen.getByText("Connecter 2")).toBeTruthy();
      expect(screen.queryByText("Connecter 3")).toBeNull();
    });

    test("connector toggle functionality works correctly", () => {
      render(<StartCharging />);

      const connector1 = screen.getByText("Connecter 1").parent;

      // Press once - should select
      fireEvent.press(connector1!);
      expect(screen.getByText("Connecter 1")).toBeTruthy();

      // Press again - should deselect (toggle behavior)
      fireEvent.press(connector1!);
      expect(screen.getByText("Connecter 1")).toBeTruthy();
    });
  });

  describe("Start Charging Navigation", () => {
    test("calls API and navigates when Start Charging button is pressed", async () => {
      mockStartSessionMutation.mutateAsync.mockResolvedValueOnce({
        success: true,
      });

      render(<StartCharging />);

      // Select a connector first
      const connector1 = screen.getByText("Connecter 1").parent;
      fireEvent.press(connector1!);

      // Press Start Charging button
      const startButton = screen.getByText("Start Charging");
      fireEvent.press(startButton);

      // Verify API call
      await waitFor(() => {
        expect(mockStartSessionMutation.mutateAsync).toHaveBeenCalledTimes(1);
      });

      expect(mockStartSessionMutation.mutateAsync).toHaveBeenCalledWith({
        id: expect.any(String),
        station_id: "Tesla Supercharger",
        status: "ACTIVE",
        start_time: expect.any(String),
        charge_rate: 0.25,
      });

      // Verify navigation
      expect(router.push).toHaveBeenCalledWith({
        pathname: "/chargingSession",
        params: {
          chargeRate: 0.25,
          connector: 0, // First connector has id 0
          powerRating: "150",
          sessionId: expect.any(String),
        },
      });
    });

    test("handles API error  during session start", async () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
      mockStartSessionMutation.mutateAsync.mockRejectedValueOnce(
        new Error("API Error")
      );

      render(<StartCharging />);

      const connector1 = screen.getByText("Connecter 1").parent;
      fireEvent.press(connector1!);

      const startButton = screen.getByText("Start Charging");
      fireEvent.press(startButton);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          "Error starting charge session",
          expect.any(Error)
        );
      });

      // Should not navigate on error
      expect(router.push).not.toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    test("passes correct connector ID in navigation params", async () => {
      mockStartSessionMutation.mutateAsync.mockResolvedValueOnce({
        success: true,
      });

      render(<StartCharging />);

      // Select connector 2 (id: 1)
      const connector2 = screen.getByText("Connecter 2").parent;
      fireEvent.press(connector2!);

      const startButton = screen.getByText("Start Charging");
      fireEvent.press(startButton);

      await waitFor(() => {
        expect(router.push).toHaveBeenCalledWith(
          expect.objectContaining({
            params: expect.objectContaining({
              connector: 1, // Second connector has id 1
            }),
          })
        );
      });
    });
  });

  describe("Edge Cases", () => {
    test("handles missing search parameters gracefully", () => {
      mockUseLocalSearchParams.mockReturnValue({});

      render(<StartCharging />);

      // Should render without crashing
      expect(screen.getByText("Choose A Connector")).toBeTruthy();
    });
  });
});
