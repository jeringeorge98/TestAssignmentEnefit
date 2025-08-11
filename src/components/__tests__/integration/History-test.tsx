import React from "react";
import { render, screen } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import History from "../../../app/(tabs)/history";
import { useGetChargingSessions } from "../../../api";
import { ChargingSessions } from "../../../types";

// Mock the API hook
jest.mock("../../../api", () => ({
  useGetChargingSessions: jest.fn(),
}));

// Mock Colors
jest.mock("../../../constants/Colors", () => ({
  textPrimary: "#000000",
  textSecondary: "#666666",
  textTertiary: "#999999",
  background: "#ffffff",
  border: "#cccccc",
  cardBackground: "#f9f9f9",
}));

const mockUseGetChargingSessions = useGetChargingSessions as jest.MockedFunction<
  typeof useGetChargingSessions
>;

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

describe("<History />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Duration Calculation Tests", () => {
    test("calculates duration correctly with valid dates", () => {
      const mockData: ChargingSessions[] = [
        {
          id: "1",
          station_id: "Tesla Supercharger",
          start_time: "2025-01-01T10:00:00.000Z",
          end_time: "2025-01-01T11:30:00.000Z",
          charge_rate: 0.25,
          status: "COMPLETED",
        },
      ];

      mockUseGetChargingSessions.mockReturnValue({
        data: mockData,
        isLoading: false,
        error: null,
      } as any);

      renderWithQueryClient(<History />);

      // 1.5 hours = 5400 seconds
      expect(screen.getByText("Duration 5400 seconds")).toBeTruthy();
      expect(screen.getByText("Tesla Supercharger")).toBeTruthy();
    });

    test("handles different duration calculations correctly", () => {
      const mockData: ChargingSessions[] = [
        {
          id: "1",
          station_id: "Station 1",
          start_time: "2025-01-01T10:00:00.000Z",
          end_time: "2025-01-01T10:15:00.000Z", // 15 minutes = 900 seconds
          charge_rate: 0.25,
          status: "COMPLETED",
        },
        {
          id: "2",
          station_id: "Station 2",
          start_time: "2025-01-01T12:00:00.000Z",
          end_time: "2025-01-01T14:05:00.000Z", // 2 hours 5 minutes = 7500 seconds
          charge_rate: 0.30,
          status: "COMPLETED",
        },
      ];

      mockUseGetChargingSessions.mockReturnValue({
        data: mockData,
        isLoading: false,
        error: null,
      } as any);

      renderWithQueryClient(<History />);

      expect(screen.getByText("Duration 900 seconds")).toBeTruthy();
      expect(screen.getByText("Duration 7500 seconds")).toBeTruthy();
    });

    test("handles zero duration correctly", () => {
      const mockData: ChargingSessions[] = [
        {
          id: "1",
          station_id: "Quick Stop",
          start_time: "2025-01-01T10:00:00.000Z",
          end_time: "2025-01-01T10:00:00.000Z", // Same time = 0 seconds
          charge_rate: 0.25,
          status: "COMPLETED",
        },
      ];

      mockUseGetChargingSessions.mockReturnValue({
        data: mockData,
        isLoading: false,
        error: null,
      } as any);

      renderWithQueryClient(<History />);

      expect(screen.getByText("Duration 0 seconds")).toBeTruthy();
    });
  });

  describe("Null/Undefined Date Handling", () => {
    test("handles null end_time gracefully", () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
      
      const mockData: ChargingSessions[] = [
        {
          id: "1",
          station_id: "Active Station",
          start_time: "2025-01-01T10:00:00.000Z",
          end_time: null as any, // Null end_time
          charge_rate: 0.25,
          status: "ACTIVE",
        },
      ];

      mockUseGetChargingSessions.mockReturnValue({
        data: mockData,
        isLoading: false,
        error: null,
      } as any);

      // This should either crash or handle gracefully
      expect(() => {
        renderWithQueryClient(<History />);
      }).not.toThrow();

      consoleErrorSpy.mockRestore();
    });

    test("handles null start_time gracefully", () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
      
      const mockData: ChargingSessions[] = [
        {
          id: "1",
          station_id: "Station with null start",
          start_time: null as any, // Null start_time
          end_time: "2025-01-01T11:00:00.000Z",
          charge_rate: 0.25,
          status: "COMPLETED",
        },
      ];

      mockUseGetChargingSessions.mockReturnValue({
        data: mockData,
        isLoading: false,
        error: null,
      } as any);

      expect(() => {
        renderWithQueryClient(<History />);
      }).not.toThrow();

      consoleErrorSpy.mockRestore();
    });

    test("handles both start_time and end_time being null", () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
      
      const mockData: ChargingSessions[] = [
        {
          id: "1",
          station_id: "Station with null dates",
          start_time: null as any,
          end_time: null as any,
          charge_rate: 0.25,
          status: "COMPLETED",
        },
      ];

      mockUseGetChargingSessions.mockReturnValue({
        data: mockData,
        isLoading: false,
        error: null,
      } as any);

      expect(() => {
        renderWithQueryClient(<History />);
      }).not.toThrow();

      consoleErrorSpy.mockRestore();
    });

    test("handles undefined dates", () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
      
      const mockData: ChargingSessions[] = [
        {
          id: "1",
          station_id: "Station with undefined dates",
          start_time: undefined,
          end_time: undefined,
          charge_rate: 0.25,
          status: "COMPLETED",
        },
      ];

      mockUseGetChargingSessions.mockReturnValue({
        data: mockData,
        isLoading: false,
        error: null,
      } as any);

      expect(() => {
        renderWithQueryClient(<History />);
      }).not.toThrow();

      consoleErrorSpy.mockRestore();
    });
  });

  describe("Invalid Date String Handling", () => {
    test("handles invalid date strings", () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
      
      const mockData: ChargingSessions[] = [
        {
          id: "1",
          station_id: "Invalid Date Station",
          start_time: "invalid-date-string",
          end_time: "another-invalid-date",
          charge_rate: 0.25,
          status: "COMPLETED",
        },
      ];

      mockUseGetChargingSessions.mockReturnValue({
        data: mockData,
        isLoading: false,
        error: null,
      } as any);

      expect(() => {
        renderWithQueryClient(<History />);
      }).not.toThrow();

      consoleErrorSpy.mockRestore();
    });

    test("handles mixed valid and invalid dates", () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
      
      const mockData: ChargingSessions[] = [
        {
          id: "1",
          station_id: "Mixed Date Station",
          start_time: "2025-01-01T10:00:00.000Z", // Valid
          end_time: "invalid-end-date", // Invalid
          charge_rate: 0.25,
          status: "COMPLETED",
        },
        {
          id: "2",
          station_id: "Another Station",
          start_time: "invalid-start-date", // Invalid
          end_time: "2025-01-01T11:00:00.000Z", // Valid
          charge_rate: 0.30,
          status: "COMPLETED",
        },
      ];

      mockUseGetChargingSessions.mockReturnValue({
        data: mockData,
        isLoading: false,
        error: null,
      } as any);

      expect(() => {
        renderWithQueryClient(<History />);
      }).not.toThrow();

      consoleErrorSpy.mockRestore();
    });

    test("handles empty string dates", () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
      
      const mockData: ChargingSessions[] = [
        {
          id: "1",
          station_id: "Empty Date Station",
          start_time: "",
          end_time: "",
          charge_rate: 0.25,
          status: "COMPLETED",
        },
      ];

      mockUseGetChargingSessions.mockReturnValue({
        data: mockData,
        isLoading: false,
        error: null,
      } as any);

      expect(() => {
        renderWithQueryClient(<History />);
      }).not.toThrow();

      consoleErrorSpy.mockRestore();
    });
  });

  describe("Malformed Data Handling", () => {
    test("handles sessions with missing required fields", () => {
      const mockData: ChargingSessions[] = [
        {
          id: "1",
          status: "COMPLETED",
          // Missing start_time, end_time, station_id, charge_rate
        } as ChargingSessions,
      ];

      mockUseGetChargingSessions.mockReturnValue({
        data: mockData,
        isLoading: false,
        error: null,
      } as any);

      expect(() => {
        renderWithQueryClient(<History />);
      }).not.toThrow();
    });

    test("handles array with null items and exposes the crash", () => {
      const mockData = [
        {
          id: "1",
          station_id: "Valid Station",
          start_time: "2025-01-01T10:00:00.000Z",
          end_time: "2025-01-01T11:00:00.000Z",
          charge_rate: 0.25,
          status: "COMPLETED",
        },
        null, // Null item in array - this will cause a crash in keyExtractor
        {
          id: "3",
          station_id: "Another Valid Station",
          start_time: "2025-01-01T12:00:00.000Z",
          end_time: "2025-01-01T13:00:00.000Z",
          charge_rate: 0.30,
          status: "COMPLETED",
        },
      ] as ChargingSessions[];

      mockUseGetChargingSessions.mockReturnValue({
        data: mockData,
        isLoading: false,
        error: null,
      } as any);

      // This test exposes a real bug: keyExtractor crashes on null items
      expect(() => {
        renderWithQueryClient(<History />);
      }).toThrow("Cannot read properties of null (reading 'id')");
    });

    test("handles negative duration results", () => {
      const mockData: ChargingSessions[] = [
        {
          id: "1",
          station_id: "Time Travel Station",
          start_time: "2025-01-01T12:00:00.000Z", // Later time
          end_time: "2025-01-01T10:00:00.000Z",   // Earlier time
          charge_rate: 0.25,
          status: "COMPLETED",
        },
      ];

      mockUseGetChargingSessions.mockReturnValue({
        data: mockData,
        isLoading: false,
        error: null,
      } as any);

      renderWithQueryClient(<History />);

      // Should display negative duration (-7200 seconds = -2 hours)
      expect(screen.getByText("Duration -7200 seconds")).toBeTruthy();
    });
  });

  describe("Component States", () => {
    test("displays loading state correctly (exposes component logic bug)", () => {
      mockUseGetChargingSessions.mockReturnValue({
        data: null,
        isLoading: true,
        error: null,
      } as any);

      renderWithQueryClient(<History />);

      // BUG: The component checks !data before isLoading, so it shows error message during loading
      // This test documents the current buggy behavior
      expect(screen.getByText("No History Available")).toBeTruthy();
      
      // The loading indicator is never shown due to incorrect condition order
      expect(screen.queryByText("History")).toBeNull();
    });

    test("displays error state correctly", () => {
      mockUseGetChargingSessions.mockReturnValue({
        data: null,
        isLoading: false,
        error: new Error("Network error"),
      } as any);

      renderWithQueryClient(<History />);

      expect(screen.getByText("No History Available")).toBeTruthy();
    });

    test("displays no data state correctly", () => {
      mockUseGetChargingSessions.mockReturnValue({
        data: null,
        isLoading: false,
        error: null,
      } as any);

      renderWithQueryClient(<History />);

      expect(screen.getByText("No History Available")).toBeTruthy();
    });

    test("displays empty data array correctly", () => {
      mockUseGetChargingSessions.mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
      } as any);

      renderWithQueryClient(<History />);

      // Should display History title
      expect(screen.getByText("History")).toBeTruthy();
      // Should not crash with empty array
    });
  });

  describe("Rendering with Valid Data", () => {
    test("displays all session information correctly", () => {
      const mockData: ChargingSessions[] = [
        {
          id: "session-1",
          station_id: "Tesla Downtown",
          start_time: "2025-01-01T10:00:00.000Z",
          end_time: "2025-01-01T12:00:00.000Z",
          charge_rate: 0.28,
          status: "COMPLETED",
        },
      ];

      mockUseGetChargingSessions.mockReturnValue({
        data: mockData,
        isLoading: false,
        error: null,
      } as any);

      renderWithQueryClient(<History />);

      // Check all displayed information
      expect(screen.getByText("History")).toBeTruthy();
      expect(screen.getByText("Tesla Downtown")).toBeTruthy();
      expect(screen.getByText("2025-01-01T10:00:00.000Z")).toBeTruthy();
      expect(screen.getByText("Duration 7200 seconds")).toBeTruthy();
      expect(screen.getByText("0.28 kw/H")).toBeTruthy();
    });

    test("displays multiple sessions correctly", () => {
      const mockData: ChargingSessions[] = [
        {
          id: "1",
          station_id: "Station A",
          start_time: "2025-01-01T10:00:00.000Z",
          end_time: "2025-01-01T11:00:00.000Z",
          charge_rate: 0.25,
          status: "COMPLETED",
        },
        {
          id: "2",
          station_id: "Station B",
          start_time: "2025-01-01T14:00:00.000Z",
          end_time: "2025-01-01T15:30:00.000Z",
          charge_rate: 0.30,
          status: "COMPLETED",
        },
      ];

      mockUseGetChargingSessions.mockReturnValue({
        data: mockData,
        isLoading: false,
        error: null,
      } as any);

      renderWithQueryClient(<History />);

      expect(screen.getByText("Station A")).toBeTruthy();
      expect(screen.getByText("Station B")).toBeTruthy();
      expect(screen.getByText("Duration 3600 seconds")).toBeTruthy(); // 1 hour
      expect(screen.getByText("Duration 5400 seconds")).toBeTruthy(); // 1.5 hours
    });
  });
});