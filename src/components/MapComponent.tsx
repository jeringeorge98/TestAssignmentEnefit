import React from "react";
import { StyleSheet, View } from "react-native";
import MapView, { PROVIDER_GOOGLE, Region, Marker } from "react-native-maps";

type MapComponentProps = {
  markers: Region[];
};

export default function MapComponent({ markers }: MapComponentProps) {
  const initialRegion: Region = {
    latitude: 59.437,
    longitude: 24.7536,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };
  return (
    <View style={styles.baseContainer}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
        showsMyLocationButton={true}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  baseContainer: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
