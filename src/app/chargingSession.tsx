import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import { router, useLocalSearchParams } from "expo-router";
import { useUpdateChargeSession } from "../api";
import { ChargingSessions } from "../types";

export default function ChargingSession() {
  const updateChargeSession = useUpdateChargeSession();
  const [chargeStatus, setChargeStatus] = useState(true);
  const { chargeRate, connector, powerRating, sessionId } =
    useLocalSearchParams();

  const handleStopCharging = async () => {
    if (!chargeStatus) {
      router.push("/(tabs)/history");
      return;
    }

    try {
      const sessionRequest: ChargingSessions = {
        id: sessionId as string,
        end_time: new Date().toISOString(),
        status: "COMPLETED",
      };
      const response = await updateChargeSession.mutateAsync(sessionRequest);
      console.log("response", response);
      setChargeStatus(false);
    } catch (error) {
      console.error("Error stopping charge session", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Animated background grid */}
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>CHARGING SESSION</Text>
        <View style={styles.statusIndicator}>
          <Text style={styles.statusText}>
            {chargeStatus ? "ACTIVE" : "COMPLETED"}
          </Text>
        </View>
      </View>

      {/* Main charging area */}
      <View style={styles.chargingArea}>
        {/* Charging animation */}

        <LottieView
          source={require("../../assets/lottie/ev-charging (1).json")}
          autoPlay
          loop
          style={styles.chargingAnimation}
          resizeMode="contain"
        />
      </View>

      {/* Stats grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <MaterialIcons
            name="euro"
            size={24}
            color={Colors.neonLight.primary}
          />
          <Text style={styles.statValue}>{chargeRate} /kWh</Text>
          <Text style={styles.statLabel}>Charge Rate</Text>
        </View>

        <View style={styles.statCard}>
          <MaterialIcons
            name="power"
            size={24}
            color={Colors.neonLight.primary}
          />
          <Text style={styles.statValue}>{powerRating} kW</Text>
          <Text style={styles.statLabel}>Power Rating</Text>
        </View>
        <View style={styles.statCard}>
          <MaterialIcons
            name="settings-input-svideo"
            size={24}
            color={Colors.neonLight.primary}
          />
          <Text style={styles.statValue}>
            {parseInt(connector as string) + 1}
          </Text>
          <Text style={styles.statLabel}>Connector</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.stopButton} onPress={handleStopCharging}>
        <LinearGradient
          colors={[Colors.colorPrimaryGreen, Colors.neonLight.glow]}
          style={styles.buttonGradient}
        >
          {chargeStatus ? (
            <MaterialIcons name="stop" size={24} color="white" />
          ) : (
            <MaterialIcons name="history" size={24} color="white" />
          )}

          <Text style={styles.buttonText}>
            {chargeStatus ? "Stop Charging" : "View History"}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neonLight.background,
  },

  // Header
  header: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 30,
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.colorPrimaryGreen,
    textShadowColor: Colors.neonLight.glow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    letterSpacing: 2,
  },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  statusText: {
    color: Colors.neonLight.text,
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 1,
  },

  // Charging area
  chargingArea: {
    alignItems: "center",
    marginVertical: 30,
    width: "100%",
    height: "50%",
  },

  chargingAnimation: {
    width: "100%",
    height: "100%",
  },

  // Stats grid
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    marginVertical: 20,
    gap: 10,
  },
  statCard: {
    backgroundColor: Colors.neonLight.surface,
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.neonLight.primary,
    minWidth: 50,
  },
  statValue: {
    color: Colors.neonLight.text,
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 8,
  },
  statLabel: {
    color: Colors.neonLight.textSecondary,
    fontSize: 12,
    marginTop: 4,
    letterSpacing: 1,
  },

  // Stop button
  stopButton: {
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 15,
    shadowColor: Colors.neonLight.glow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
    flex: 1,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 15,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
    letterSpacing: 1,
  },
});
