import { ActivityIndicator, StyleSheet } from "react-native";
import { Text, View } from "@/src/components/Themed";
import MapComponent from "@/src/components/MapComponent";
import { useGetStations } from "@/src/api";
import { Region } from "react-native-maps";
import { stationData } from "@/src/types";
export default function MapsScreen() {
  // need to display a map with the markers
  const { data, isLoading, error } = useGetStations();

  console.log("Station data", data);

  if (isLoading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (!data || error)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ alignContent: "center" }}>
          No Data Found or Error fetching data
        </Text>
      </View>
    );
  return (
    <View style={styles.container}>
      <MapComponent markers={data as stationData[]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
