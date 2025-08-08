import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { stationData } from "../types";
import Colors from "../constants/Colors";

type ChargeViewDetailsCardComponentProps = {
  stationDetails: stationData;
};

const ChargeViewDetailsCardComponent = ({
  stationDetails,
}: ChargeViewDetailsCardComponentProps) => {
  return (
    <View style={styles.CardContainer}>
      <Text>ChargeViewDetailsCardComponent</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  CardContainer: {
    flex: 1,
    backgroundColor: Colors.cardBackground,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderColor: Colors.border,
  },
});

export default ChargeViewDetailsCardComponent;
