const tintColorLight = "#2f95dc";
const tintColorDark = "#fff";

export default {
  light: {
    text: "#000",
    background: "#fff",
    tint: tintColorLight,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#fff",
    background: "#000",
    tint: tintColorDark,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorDark,
  },

  // Background Colors
  background: "#F8FAFC", // Very light gray-blue background
  cardBackground: "#FFFFFF", // Pure white for cards
  surface: "#F1F5F9", // Light gray for secondary surfaces

  // Text Colors
  textPrimary: "#1E293B", // Dark slate for main text
  textSecondary: "#64748B", // Medium gray for secondary text
  textTertiary: "#94A3B8", // Light gray for tertiary text

  // Status Colors
  statusAvailable: "#10B981", // Green for available stations
  statusOccupied: "#F59E0B", // Amber for occupied stations
  statusOffline: "#EF4444", // Red for offline/out of service
  statusMaintenance: "#8B5CF6", // Purple for maintenance

  // Power Rating Colors
  powerHigh: "#059669", // Dark green for high power (100kW+)
  powerMedium: "#D97706", // Orange for medium power (50-99kW)
  powerLow: "#DC2626", // Red for low power (<50kW)

  // Border and Shadow
  border: "#E2E8F0", // Light gray for borders
  shadow: "rgba(0, 0, 0, 0.1)", // Subtle shadow

  // Success/Error Colors
  success: "#10B981", // Green for success states
  error: "#EF4444", // Red for error states
  warning: "#F59E0B",
};
