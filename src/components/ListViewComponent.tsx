import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { stationData } from "../types/index";
import Colors from "../constants/Colors";
import { router } from "expo-router";

type ListViewComponentProps = {
  data: stationData;
};

export const ListViewComponent = ({
  data: stationData,
}: ListViewComponentProps) => {
  const handleOnPress = () => {
    router.push({
      pathname: "/startCharging",
      params: {
        stationName: stationData.name,
        noOfConnectors: stationData.connectors.length.toString(),
        powerRating: stationData.power_rating.toString(),
      },
    });
  };

  return (
    <Pressable style={styles.container} onPress={handleOnPress} testID="list-item-pressable">
      <View style={styles.rowView}>
        <Text
          style={{
            color: Colors.textPrimary,
            fontSize: 16,
            fontWeight: "bold",
          }}
        >
          {stationData.name}
        </Text>
        <Text>{stationData.status}</Text>
      </View>
      <View style={styles.rowView}>
        <Text
          style={{
            color: Colors.textSecondary,
            fontSize: 14,
            maxWidth: "70%",
          }}
          numberOfLines={2}
        >
          {stationData.address}
        </Text>
        <Text style={{ color: Colors.textTertiary, fontSize: 14 }}>
          {stationData.power_rating} kWh
        </Text>
      </View>
    </Pressable>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
    borderRadius: 20,
    elevation: 3,
    borderWidth: 0.5,
    padding: 20,
    borderColor: Colors.border,
    backgroundColor: Colors.cardBackground,
  },
  rowView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 1,
  },
});
