import Colors from "@/src/constants/Colors";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useGetChargingSessions } from "../../api/index";
import { FlatList } from "react-native-gesture-handler";
export default function History() {
  const { data, isLoading, error } = useGetChargingSessions();
  if (!data || error) {
    return <Text>No History Available</Text>;
  }
  if (isLoading) {
    return <ActivityIndicator style={{ flex: 1, alignSelf: "center" }} />;
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>History</Text>
      <FlatList
        data={data}
        renderItem={({ item }) => {
          return <Text>{item.id}</Text>;
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    paddingVertical: 20,
  },
});
