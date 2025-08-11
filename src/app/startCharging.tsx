import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  ToastAndroid,
  Alert,
} from "react-native";
import { useState, useEffect } from "react";
import Toast from "react-native-toast-message";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import Colors from "../constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import Button from "../components/Button";
import {
  useGetSpotPrice,
  useStartChargeSession,
  useUpdateChargeSession,
} from "../api/index";
import { ChargingSessions } from "../types";
interface Connector {
  id: number;
  isSelected: boolean;
}

export default function StartCharging() {
  const startChargeSession = useStartChargeSession();
  const params = useLocalSearchParams();
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const stationName = params.stationName as string;
  const noOfConnectors = params.noOfConnectors as string;
  const powerRating = params.powerRating as string;

  const { data: spotPrice, isLoading, error } = useGetSpotPrice();

  useEffect(() => {
    const connectorsArray = Array.from(
      { length: parseInt(noOfConnectors) },
      (_, i) => ({
        id: i,
        isSelected: false,
      })
    );
    setConnectors(connectorsArray);
  }, [noOfConnectors]);

  const handleConnectorPress = (item: Connector) => {
    setConnectors((prevConnectors) =>
      prevConnectors.map((connector) =>
        connector.id === item.id
          ? { ...connector, isSelected: !connector.isSelected }
          : connector
      )
    );
  };

  const handleStartCharging = async () => {
    // start charging session
    try {
      if (!connectors.find((item) => item.isSelected == true)) {
        Alert.alert("Information", "Please Choose a Connector", [
          {
            text: "Cancel",
            style: "cancel",
          },
        ]);
        return;
      }

      const sessionId = Math.random().toString();
      const sessionRequest: ChargingSessions = {
        id: sessionId,
        station_id: stationName,
        status: "ACTIVE",
        start_time: new Date().toISOString(),
        charge_rate: spotPrice?.rate,
      };
      const response = await startChargeSession.mutateAsync(sessionRequest);
      console.log("response", response);
      // navigate to the chargins sessions screen
      router.push({
        pathname: "/chargingSession",
        params: {
          chargeRate: spotPrice?.rate,
          connector: connectors.find((connector) => connector.isSelected)?.id,
          powerRating: powerRating,
          sessionId: sessionId,
        },
      });
    } catch (error) {
      console.error("Error starting charge session", error);
    }
  };

  const getConnectorView = () => {
    return (
      <FlatList
        data={connectors}
        keyExtractor={(item) => item.id.toString()}
        horizontal={true}
        contentContainerStyle={{
          gap: 10,
        }}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.connectionViewStyle,
                {
                  backgroundColor: item.isSelected
                    ? Colors.colorPrimaryGreen
                    : Colors.shadow,
                },
              ]}
              onPress={() => handleConnectorPress(item)}
            >
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MaterialIcons
                  name="settings-input-svideo"
                  size={34}
                  color={
                    item.isSelected ? Colors.textWhite : Colors.textPrimary
                  }
                />
                <Text
                  style={{
                    color: item.isSelected
                      ? Colors.textWhite
                      : Colors.textPrimary,
                  }}
                >
                  Connecter {item.id + 1}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.stationCard}>
        <View style={styles.stationHeader}>
          <MaterialIcons
            name="electric-car"
            size={32}
            color={Colors.colorPrimaryGreen}
          />
          <View style={styles.stationInfo}>
            <Text style={styles.stationName}>{stationName} Station</Text>
          </View>
        </View>
        <Toast />
        <Text
          style={{
            color: Colors.textSecondary,
            fontSize: 16,
            fontWeight: "700",
            marginLeft: 5,
          }}
        >
          {noOfConnectors} Connectors Available
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Maximum Power Rating</Text>
          <MaterialIcons
            name="power"
            size={20}
            color={Colors.colorPrimaryGreen}
          />
        </View>
        <View style={styles.feeRow}>
          <Text style={styles.feeLabel}> In kW</Text>
          <Text style={styles.feeAmount}>{powerRating} kW max</Text>
        </View>
      </View>

      {/* Charging Fees Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Charging Fees</Text>
          <MaterialIcons
            name="info-outline"
            size={20}
            color={Colors.textSecondary}
          />
        </View>
        <View style={styles.feeRow}>
          <Text style={styles.feeLabel}>Rate per kWh</Text>
          <Text style={styles.feeAmount}>
            {spotPrice?.rate} {spotPrice?.curreny}/kWh
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Choose A Connector</Text>
      </View>
      <View style={styles.connectorRow}>{getConnectorView()}</View>

      {/* Start Charging Button */}
      <View style={styles.bottomContainer}>
        <Button
          title="Start Charging"
          style={styles.startButton}
          textStyle={styles.startButtonText}
          onPress={handleStartCharging}
          icon={<MaterialIcons name="bolt" size={24} color="white" />}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: Colors.background,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.cardBackground,
  },
  connectionViewStyle: {
    borderRadius: 8,
    elevation: 3,
    height: 90,
    width: 100,
    marginTop: 10,
  },
  startButtonText: {
    color: Colors.textWhite,
    fontSize: 16,
    fontWeight: "600",
  },
  connectorRow: {
    flex: 1,
    flexDirection: "row",
    gap: 10,
    backgroundColor: Colors.cardBackground,
    paddingHorizontal: 20,
  },
  startButton: {
    backgroundColor: Colors.colorPrimaryGreen,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  detailText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  stationDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stationCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  stationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  stationInfo: {
    marginLeft: 12,
    flex: 1,
  },
  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  paymentText: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  stationName: {
    fontSize: 21,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  stationLocation: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 20,
    marginTop: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  feeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  feeLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  feeAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
});
