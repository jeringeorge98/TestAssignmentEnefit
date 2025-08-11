import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react-native";
import ChargingSession from "../../../app/chargingSession";
import { router } from "expo-router";
import { useUpdateChargeSession } from "../../../api";

// Mock dependencies
jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
  useLocalSearchParams: jest.fn(),
}));

jest.mock("../../../api", () => ({
  useUpdateChargeSession: jest.fn(),
}));

jest.mock("lottie-react-native", () => {
  const { View } = require("react-native");
  return function MockLottieView(props: any) {
    return <View testID="lottie-animation" {...props} />;
  };
});

jest.mock("expo-linear-gradient", () => ({
  LinearGradient: ({ children, ...props }: any) => {
    const { View } = require("react-native");
    return (
      <View testID="linear-gradient" {...props}>
        {children}
      </View>
    );
  },
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

const mockUseLocalSearchParams = require("expo-router").useLocalSearchParams;
const mockUseUpdateChargeSession =
  useUpdateChargeSession as jest.MockedFunction<typeof useUpdateChargeSession>;

const mockSearchParams = {
  chargeRate: "0.25",
  connector: "1",
  powerRating: "150",
  sessionId: "session-123",
};

const mockUpdateMutation = {
  mutateAsync: jest.fn(),
  isLoading: false,
  error: null,
};

describe("<ChargingSession />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLocalSearchParams.mockReturnValue(mockSearchParams);
    mockUseUpdateChargeSession.mockReturnValue(mockUpdateMutation);
  });

  describe("Props Display", () => {
    test("displays all passed parameters correctly", () => {
      render(<ChargingSession />);

      // Check header
      expect(screen.getByText("CHARGING SESSION")).toBeTruthy();
      expect(screen.getByText("ACTIVE")).toBeTruthy();

      // Check charge rate display
      expect(screen.getByText("0.25 /kWh")).toBeTruthy();
      expect(screen.getByText("Charge Rate")).toBeTruthy();

      // Check power rating display
      expect(screen.getByText("150 kW")).toBeTruthy();
      expect(screen.getByText("Power Rating")).toBeTruthy();

      // Check connector display (connector + 1)
      expect(screen.getByText("2")).toBeTruthy(); // connector '1' + 1 = 2
      expect(screen.getByText("Connector")).toBeTruthy();
    });

    test("renders required UI components", () => {
      render(<ChargingSession />);

      // Check if main components are rendered
      expect(screen.getByTestId("lottie-animation")).toBeTruthy();
      expect(screen.getByTestId("linear-gradient")).toBeTruthy();

      // Check if all icons are present
      expect(screen.getByTestId("icon-euro")).toBeTruthy();
      expect(screen.getByTestId("icon-power")).toBeTruthy();
      expect(screen.getByTestId("icon-settings-input-svideo")).toBeTruthy();
      expect(screen.getByTestId("icon-stop")).toBeTruthy(); // Initial state should show stop icon
    });
  });

  describe("Stop Button Functionality", () => {
    test('initially shows "Stop Charging" button with ACTIVE status', () => {
      render(<ChargingSession />);

      expect(screen.getByText("Stop Charging")).toBeTruthy();
      expect(screen.getByText("ACTIVE")).toBeTruthy();
      expect(screen.getByTestId("icon-stop")).toBeTruthy();
    });

    test("calls updateChargeSession when stop button is pressed", async () => {
      mockUpdateMutation.mutateAsync.mockResolvedValueOnce({ success: true });

      render(<ChargingSession />);

      const stopButton = screen.getByText("Stop Charging");
      fireEvent.press(stopButton);

      await waitFor(() => {
        expect(mockUpdateMutation.mutateAsync).toHaveBeenCalledTimes(1);
      });

      expect(mockUpdateMutation.mutateAsync).toHaveBeenCalledWith({
        id: "session-123",
        end_time: expect.any(String),
        status: "COMPLETED",
      });
    });

    test("updates UI to COMPLETED state after successful stop", async () => {
      mockUpdateMutation.mutateAsync.mockResolvedValueOnce({ success: true });

      render(<ChargingSession />);

      const stopButton = screen.getByText("Stop Charging");
      fireEvent.press(stopButton);

      await waitFor(() => {
        expect(screen.getByText("COMPLETED")).toBeTruthy();
      });

      // After stopping, button should change to "View History"
      expect(screen.getByText("View History")).toBeTruthy();
      expect(screen.getByTestId("icon-history")).toBeTruthy();
    });

    test("navigates to history screen when button is pressed in COMPLETED state", async () => {
      mockUpdateMutation.mutateAsync.mockResolvedValueOnce({ success: true });

      render(<ChargingSession />);

      // First click - stop charging
      const stopButton = screen.getByText("Stop Charging");
      fireEvent.press(stopButton);

      await waitFor(() => {
        expect(screen.getByText("View History")).toBeTruthy();
      });

      // Second click - navigate to history
      const historyButton = screen.getByText("View History");
      fireEvent.press(historyButton);

      expect(router.push).toHaveBeenCalledWith("/(tabs)/history");
    });

    test("handles API error gracefully", async () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
      mockUpdateMutation.mutateAsync.mockRejectedValueOnce(
        new Error("Network error")
      );

      render(<ChargingSession />);

      const stopButton = screen.getByText("Stop Charging");
      fireEvent.press(stopButton);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          "Error stopping charge session",
          expect.any(Error)
        );
      });

      // Should remain in ACTIVE state after error
      expect(screen.getByText("ACTIVE")).toBeTruthy();
      expect(screen.getByText("Stop Charging")).toBeTruthy();

      consoleErrorSpy.mockRestore();
    });
  });

  describe("Edge Cases", () => {
    test("handles missing search parameters gracefully", () => {
      mockUseLocalSearchParams.mockReturnValue({});

      render(<ChargingSession />);

      // Should render without crashing
      expect(screen.getByText("CHARGING SESSION")).toBeTruthy();
      expect(screen.getByText("ACTIVE")).toBeTruthy();
    });
  });
});
