import { ActivityIndicator, StyleSheet, FlatList } from "react-native";
import { Text, View } from "@/src/components/Themed";
import { useGetStations } from "@/src/api";
import React, { useCallback } from "react";
import { ListViewComponent } from "@/src/components/ListViewComponent";
import { stationData } from "@/src/types";
import Colors from "@/src/constants/Colors";

export default function ListScreen() {
  const { data, isLoading, error } = useGetStations();

  if (!data || isLoading)
    return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text>Error: {error.message}</Text>;

  // Memoized render item
  const renderItem = useCallback(
    ({ item }: { item: stationData }) => <ListViewComponent data={item} />,
    []
  );

  return (
    <View style={listScreenStyles.container}>
      <Text style={listScreenStyles.title}>Charging Stations</Text>
      <FlatList
        data={data || []}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ gap: 10 }}
      />
    </View>
  );
}

const listScreenStyles = StyleSheet.create({
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
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
