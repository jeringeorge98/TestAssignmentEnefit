import React, { useCallback, useRef, useState } from "react";
import { withModalProvider } from "./withModalProvider";
import { StyleSheet, View, Image } from "react-native";
import MapView, {
  PROVIDER_GOOGLE,
  Region,
  Marker,
  Callout,
} from "react-native-maps";
import { stationData } from "@/src/types";
// import ChargeViewDetailsCardComponent from "./ChargeViewDetailsCardComponent";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { ChargeViewDetailsCardComponent } from "./ChargeViewDetailsCardComponent";
type MapComponentProps = {
  markers: stationData[];
};

// const ChargerIcon = require("@/assets/images/charger.png");

const MapComponent = ({ markers }: MapComponentProps) => {
  const mapRef = useRef<MapView>(null);
  const chargeDetailsCardref = useRef<BottomSheetModal>(null);
  const [selectedStation, setSelectedStation] = useState<stationData>();

  const handleMarkerPress = useCallback((station: stationData) => {
    console.log(station);
    centerOnStation(station);
    setSelectedStation(station);

    chargeDetailsCardref.current?.present(station);
  }, []);

  // Function to center map on a specific station
  const centerOnStation = (station: stationData) => {
    mapRef.current?.animateToRegion(
      {
        latitude: station.geocode.lat,
        longitude: station.geocode.lng,
        latitudeDelta: 0.01, // Zoom in closer
        longitudeDelta: 0.01,
      },
      1000
    ); // 1 second animation
  };

  const initialRegion: Region = {
    latitude: 59.417,
    longitude: 24.7536,
    latitudeDelta: 0.08,
    longitudeDelta: 0.08,
  };
  return (
    <View style={styles.baseContainer}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
        ref={mapRef}
      >
        <Marker coordinate={initialRegion} pinColor="blue"></Marker>

        {markers.map((item) => (
          <Marker
            key={item.id}
            coordinate={{
              latitude: item.geocode.lat,
              longitude: item.geocode.lng,
            }}
            title={item.name}
            description={item.status}
            onPress={() => handleMarkerPress(item)}
          >
            <Image
              source={require("../../assets/images/charger.png")}
              style={styles.markerStyle}
            />
          </Marker>
        ))}
      </MapView>
      <ChargeViewDetailsCardComponent
        ref={chargeDetailsCardref}
        stationDetails={selectedStation}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  baseContainer: {
    flex: 1,
  },

  map: {
    width: "100%",
    height: "100%",
  },
  markerStyle: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
});
export default withModalProvider(MapComponent);
