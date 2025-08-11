import Colors from "@/src/constants/Colors";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useGetChargingSessions } from "../../api/index";
import { ChargingSessions } from "@/src/types";
import { format } from "date-fns";
export default function History() {
  const { data, isLoading, error } = useGetChargingSessions();
  if (!data || error) {
    return <Text>No History Available</Text>;
  }
  if (isLoading) {
    return <ActivityIndicator style={{ flex: 1, alignSelf: "center" }} />;
  }

  const formatDate = (dateString: string) => {
    const formatDate = new Date(dateString);
    return format(formatDate, "do MMM,yyyy");
  };

  const HistoryListItem: React.FC<{ item: ChargingSessions }> = ({ item }) => {
    const duration =
      new Date(item.end_time!).getTime() - new Date(item.start_time!).getTime();
    return (
      <View style={styles.listContainer}>
        <View style={styles.rowView}>
          <Text
            style={{
              color: Colors.textPrimary,
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            {item.station_id}
          </Text>
          <Text>{item.start_time ? formatDate(item.start_time) : "Nan"}</Text>
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
            Duration {Math.floor(duration / 1000)} seconds
          </Text>
          <Text
            style={{ color: Colors.textPrimary, fontSize: 14, fontWeight: 500 }}
          >
            {item.charge_rate} kw/H
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>History</Text>
      <FlatList
        data={data}
        renderItem={({ item }) => <HistoryListItem item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 10 }}
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

  listContainer: {
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
