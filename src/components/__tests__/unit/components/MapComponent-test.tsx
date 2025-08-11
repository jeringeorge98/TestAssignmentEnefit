import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import MapComponent from "../../../MapComponent";
import { stationData } from "../../../../types";

// Mock dependencies
jest.mock("react-native-maps", () => {
  const React = require("react");
  const { View, Text, TouchableOpacity } = require("react-native");

  const MapView = React.forwardRef(({ children, ...props }: any, ref: any) => {
    React.useImperativeHandle(ref, () => ({
      animateToRegion: jest.fn(),
    }));
    return (
      <View testID="map-view" {...props}>
        {children}
      </View>
    );
  });

  const Marker = ({
    onPress,
    coordinate,
    title,
    children,
    pinColor,
    ...props
  }: any) => (
    <TouchableOpacity
      testID={
        pinColor
          ? "initial-region-marker"
          : `marker-${coordinate.latitude}-${coordinate.longitude}`
      }
      onPress={onPress}
      {...props}
    >
      <Text testID="marker-title">{title}</Text>
      {children}
    </TouchableOpacity>
  );

  return {
    __esModule: true,
    default: MapView,
    PROVIDER_GOOGLE: "google",
    Marker,
    Callout: View,
  };
});

jest.mock("../../../ChargeViewDetailsCardComponent.tsx", () => {
  const React = require("react");
  const { View, Text } = require("react-native");

  return {
    ChargeViewDetailsCardComponent: React.forwardRef(
      ({ stationDetails }: any, ref: any) => {
        React.useImperativeHandle(ref, () => ({
          present: jest.fn(),
          dismiss: jest.fn(),
        }));
        return (
          <View testID="charge-details-modal">
            {stationDetails && (
              <View testID={`modal-station-${stationDetails.id}`}>
                <Text>Station: {stationDetails.name}</Text>
              </View>
            )}
          </View>
        );
      }
    ),
  };
});

jest.mock("../../../withModalProvider.tsx", () => ({
  withModalProvider: (Component: any) => Component,
}));

jest.mock("@gorhom/bottom-sheet", () => {
  const React = require("react");
  const { View } = require("react-native");

  return {
    BottomSheetModal: React.forwardRef(
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
    ),
  };
});

const mockStationData: stationData[] = [
  {
    id: "1",
    name: "Station Alpha",
    geocode: { lat: 59.439, lng: 24.7538 },
    address: "Test Address 1",
    status: "available",
    power_rating: 50,
    distance: 1200,
    connectors: [{ power: 50, quantity: 2 }],
  },
  {
    id: "2",
    name: "Station Beta",
    geocode: { lat: 59.44, lng: 24.754 },
    address: "Test Address 2",
    status: "occupied",
    power_rating: 100,
    distance: 2100,
    connectors: [{ power: 100, quantity: 1 }],
  },
  {
    id: "3",
    name: "Station Gamma",
    geocode: { lat: 59.435, lng: 24.753 },
    address: "Test Address 3",
    status: "available",
    power_rating: 150,
    distance: 800,
    connectors: [{ power: 150, quantity: 1 }],
  },
];

describe("<MapComponent />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Markers Display", () => {
    test("renders all markers based on station data", () => {
      render(<MapComponent markers={mockStationData} />);

      // Check if MapView is rendered
      expect(screen.getByTestId("map-view")).toBeTruthy();

      // Check if all markers are rendered with correct coordinates
      expect(screen.getByTestId("marker-59.439-24.7538")).toBeTruthy(); // Station Alpha
      expect(screen.getByTestId("marker-59.44-24.754")).toBeTruthy(); // Station Beta
      expect(screen.getByTestId("marker-59.435-24.753")).toBeTruthy(); // Station Gamma

      // Check if marker titles are displayed
      const markerTitles = screen.getAllByTestId("marker-title");
      expect(markerTitles).toHaveLength(4); // 3 station markers + 1 initial region marker
      expect(screen.getByText("Station Alpha")).toBeTruthy();
      expect(screen.getByText("Station Beta")).toBeTruthy();
      expect(screen.getByText("Station Gamma")).toBeTruthy();
    });

    test("renders empty map when no markers provided", () => {
      render(<MapComponent markers={[]} />);

      expect(screen.getByTestId("map-view")).toBeTruthy();

      // Should only have the initial region marker (blue pin)
      const markerTitles = screen.queryAllByTestId("marker-title");
      expect(markerTitles).toHaveLength(1); // Only the initial region marker (no title, so empty text)

      // Check that initial marker is present
      expect(screen.getByTestId("initial-region-marker")).toBeTruthy();
    });

    test("renders correct number of markers for different datasets", () => {
      const singleStation = [mockStationData[0]];
      const { rerender } = render(<MapComponent markers={singleStation} />);

      // Should render 1 station marker + 1 initial marker
      expect(screen.getAllByTestId("marker-title")).toHaveLength(2);

      // Re-render with all stations
      rerender(<MapComponent markers={mockStationData} />);
      expect(screen.getAllByTestId("marker-title")).toHaveLength(4);
    });
  });

  describe("Modal Popup on Marker Click", () => {
    test("modal pops up when marker is clicked", () => {
      render(<MapComponent markers={mockStationData} />);

      // Initially, modal should not show any station
      expect(screen.queryByTestId("modal-station-1")).toBeNull();

      // Click on Station Alpha marker
      const alphaMarker = screen.getByTestId("marker-59.439-24.7538");
      fireEvent.press(alphaMarker);

      // Modal should now show Station Alpha details
      expect(screen.getByTestId("modal-station-1")).toBeTruthy();
      expect(screen.getByText("Station: Station Alpha")).toBeTruthy();
    });

    test("modal shows different station when different markers are clicked", () => {
      render(<MapComponent markers={mockStationData} />);

      // Click on Station Beta marker
      const betaMarker = screen.getByTestId("marker-59.44-24.754");
      fireEvent.press(betaMarker);

      // Modal should show Station Beta details
      expect(screen.getByTestId("modal-station-2")).toBeTruthy();
      expect(screen.getByText("Station: Station Beta")).toBeTruthy();

      // Click on Station Gamma marker
      const gammaMarker = screen.getByTestId("marker-59.435-24.753");
      fireEvent.press(gammaMarker);

      // Modal should now show Station Gamma details
      expect(screen.getByTestId("modal-station-3")).toBeTruthy();
      expect(screen.getByText("Station: Station Gamma")).toBeTruthy();
    });

    test("ChargeViewDetailsCardComponent is rendered", () => {
      render(<MapComponent markers={mockStationData} />);

      // Check if the modal component is present
      expect(screen.getByTestId("charge-details-modal")).toBeTruthy();
    });

    test("clicking marker updates selectedStation state", () => {
      render(<MapComponent markers={mockStationData} />);

      // Initially no station selected
      expect(screen.queryByTestId("modal-station-1")).toBeNull();
      expect(screen.queryByTestId("modal-station-2")).toBeNull();
      expect(screen.queryByTestId("modal-station-3")).toBeNull();

      // Click Station Alpha
      fireEvent.press(screen.getByTestId("marker-59.439-24.7538"));
      expect(screen.getByTestId("modal-station-1")).toBeTruthy();

      // Click Station Beta - should replace Station Alpha
      fireEvent.press(screen.getByTestId("marker-59.44-24.754"));
      expect(screen.queryByTestId("modal-station-1")).toBeNull();
      expect(screen.getByTestId("modal-station-2")).toBeTruthy();
    });
  });

  describe("Component Structure", () => {
    test("renders main container and map", () => {
      render(<MapComponent markers={mockStationData} />);

      expect(screen.getByTestId("map-view")).toBeTruthy();
      expect(screen.getByTestId("charge-details-modal")).toBeTruthy();
    });
  });
});
