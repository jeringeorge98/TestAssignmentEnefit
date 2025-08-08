import { View, Text, StyleSheet } from "react-native";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { stationData } from "../types";
import Colors from "../constants/Colors";
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
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

  useEffect(() => {
    if (stationDetails) {
      bottomSheetRef.current?.present();
    }
  }, [stationDetails]);
  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      key="StationDetailsCard"
      name="StationDetailsCard"
      snapPoints={["50%", "25%"]}
      enablePanDownToClose={true}
    >
      <BottomSheetView>
        <Text>{stationDetails?.name}</Text>
        <Text>{stationDetails?.address}</Text>
        <Text>{stationDetails?.status}</Text>
        <Text>{stationDetails?.geocode.lat}</Text>
        <Text>{stationDetails?.geocode.lng}</Text>
        <Text>{stationDetails?.geocode.lat}</Text>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  CardContainer: {
    flex: 1,
    backgroundColor: Colors.cardBackground,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderColor: Colors.border,
  },
});
