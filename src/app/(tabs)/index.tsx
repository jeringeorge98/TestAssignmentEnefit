import { StyleSheet } from "react-native";
import { Text, View } from "@/src/components/Themed";
import MapComponent from "@/src/components/MapComponent";

export default function MapsScreen() {
  // need to display a map with the markers

  return (
    <View style={styles.container}>
      <MapComponent />
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
