import {
  ActivityIndicator,
  StyleSheet,
  FlatList,
  TextInput,
} from "react-native";
import { Text, View } from "@/src/components/Themed";
import { useGetStations } from "@/src/api";
import React, { useCallback, useState } from "react";
import { ListViewComponent } from "@/src/components/ListViewComponent";
import { stationData } from "@/src/types";
import Colors from "@/src/constants/Colors";

export default function ListScreen() {
  const { data, isLoading, error } = useGetStations();
  const [filteredData, setFilteredData] = useState<stationData[]>(data || []);
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
      {/** Search button */}
      <TextInput
        style={listScreenStyles.searchInput}
        placeholder="Search"
        placeholderTextColor="black"
        inputMode="search"
        onChangeText={(text) => {
          setFilteredData(
            data.filter((station) =>
              station.name.toLowerCase().includes(text.toLowerCase())
            )
          );
        }}
      />
      <Text style={listScreenStyles.title}>Charging Stations</Text>

      <FlatList
        data={filteredData || []}
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
  searchInput: {
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 10,
    width: "100%",
    height: 50,
    marginBottom: 10,
    marginTop: 20,
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
