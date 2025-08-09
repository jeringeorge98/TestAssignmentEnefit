import { View, Text } from "react-native";
import { Connector } from "../types";
import { MaterialIcons } from "@expo/vector-icons";
import Colors from "../constants/Colors";

type ConnectorItemListProps = {
  connector: Connector;
};

export const ConnectorItemList = ({ connector }: ConnectorItemListProps) => {
  return (
    <View style={{ flex: 1, flexDirection: "row", gap: 5 }}>
      <MaterialIcons name="settings-input-svideo" size={24} color="black" />
      <View style={{ flex: 1, flexDirection: "column" }}>
        <Text style={{ color: Colors.textSecondary, fontSize: 12 }}>
          {connector.power} kW
        </Text>
        <View
          style={{
            flex: 1,
            borderRadius: 20,
            height: 20,
            width: 20,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: Colors.backgroundGrey,
          }}
        >
          <Text style={{ color: Colors.textSecondary, fontSize: 12 }}>
            x{connector.quantity}
          </Text>
        </View>
      </View>
    </View>
  );
};
