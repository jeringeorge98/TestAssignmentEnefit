import { View, Text, StyleSheet, Pressable } from "react-native";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { router } from "expo-router";
import { Connector, stationData } from "../types";
import Colors from "../constants/Colors";
import {
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { ConnectorItemList } from "./ConnectorItemList";
import { MaterialIcons } from "@expo/vector-icons";
import { FlatList } from "react-native-gesture-handler";
import Button from "./Button";
type ChargeViewDetailsCardComponentProps = {
  stationDetails: stationData | undefined;
};

export interface ChargeViewDetailsCardComponentMethods {
  present: (station: stationData) => void;
  dismiss: () => void;
}

export const ChargeViewDetailsCardComponent = forwardRef<
  ChargeViewDetailsCardComponentMethods,
  ChargeViewDetailsCardComponentProps
>(({ stationDetails }, ref) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const handlePresent = useCallback((station: stationData) => {
    bottomSheetRef.current?.present();
  }, []);

  const handleDismiss = useCallback(() => {
    bottomSheetRef.current?.dismiss();
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Connector }) => <ConnectorItemList connector={item} />,
    []
  );

  const handleStartCharging = useCallback((station: stationData) => {
    router.push({
      pathname: "/startCharging",
      params: {
        stationName: station.name,
        noOfConnectors: station.connectors.length.toString(),
        powerRating: station.power_rating.toString(),
      },
    });
  }, []);

  useEffect(() => {
    if (stationDetails) {
      bottomSheetRef.current?.present();
    }
  }, [stationDetails]);
  // Function to get status color and text
  const getStatusInfo = (status: string) => {
    switch (status?.toLowerCase()) {
      case "available":
        return {
          backgroundColor: Colors.colorPrimaryGreen, // Bright green
          textColor: "#FFFFFF",
          text: "Available",
        };
      case "occupied":
        return {
          backgroundColor: "#FF9800", // Orange/Yellow
          textColor: "#FFFFFF",
          text: "Occupied",
        };
      case "out_of_service":
        return {
          backgroundColor: "#F44336", // Red
          textColor: "#FFFFFF",
          text: "Out of Service",
        };
      default:
        return {
          backgroundColor: "#9E9E9E", // Gray
          textColor: "#FFFFFF",
          text: status || "Unknown",
        };
    }
  };
  const statusInfo = getStatusInfo(stationDetails?.status || "");
  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      key="StationDetailsCard"
      name="StationDetailsCard"
      snapPoints={["80%"]}
      enableDismissOnClose
      enablePanDownToClose={true}
      style={styles.CardContainer}
    >
      <BottomSheetView style={styles.bottmSheetView}>
        <View style={{ flex: 1, flexDirection: "row", paddingHorizontal: 2 }}>
          <Text style={styles.titleText}>{stationDetails?.name} </Text>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            gap: 16,
          }}
        >
          <View
            style={[
              styles.ContainerView,
              { backgroundColor: statusInfo.backgroundColor },
            ]}
          >
            <Text
              style={{
                color: statusInfo.textColor,
                fontSize: 12,
                fontWeight: "bold",
              }}
            >
              {statusInfo.text}
            </Text>
          </View>
          <View style={styles.ContainerView}>
            <MaterialIcons name="directions-car" size={24} color="black" />
            <Text>
              {stationDetails?.distance ? stationDetails?.distance / 1000 : 0}{" "}
              km
            </Text>
          </View>
          <View style={styles.ContainerView}>
            <MaterialIcons name="power" size={24} color="black" />
            <Text testID="power-rating-test-id">
              {stationDetails?.power_rating} kW
            </Text>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <FlatList
            data={stationDetails?.connectors}
            horizontal={true}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ gap: 15 }}
          />
        </View>
        <View>
          <Text
            style={{
              color: Colors.textPrimary,
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            Address
          </Text>
          <Text
            style={{ color: Colors.textPrimary, fontSize: 14 }}
            testID="address-test-id"
          >
            {stationDetails?.address}
          </Text>
        </View>
        <View style={{ flex: 1, marginTop: 5 }}>
          <Button
            title="Start Charging"
            style={
              statusInfo.text === "Available"
                ? styles.buttonBackgroundStyle
                : styles.disableButtonBackgroundStyle
            }
            onPress={() => handleStartCharging(stationDetails!)}
            textStyle={{
              color: Colors.textWhite,
              fontSize: 18,
              fontWeight: 500,
            }}
            icon={
              <MaterialIcons name="electric-bolt" size={24} color="white" />
            }
            disabled={statusInfo.text === "Available" ? false : true}
          />
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  CardContainer: {
    flex: 1,
    backgroundColor: Colors.cardBackground,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderColor: Colors.border,
  },
  disableButtonBackgroundStyle: {
    backgroundColor: Colors.backgroundGrey,
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    height: 50,
    alignSelf: "center",
  },
  buttonBackgroundStyle: {
    backgroundColor: Colors.colorPrimaryGreen,
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    height: 50,
    alignSelf: "center",
  },
  bottmSheetView: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 20,
    gap: 15,
  },
  ContainerView: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.shadow,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    height: "100%",
    padding: 5,
    flexDirection: "row",
  },
  titleText: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: "bold",
  },
});
