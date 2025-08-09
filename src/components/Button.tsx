import { Pressable, ViewStyle, TextStyle, Text, View } from "react-native";

type ButtonProps = {
  onPress: () => void;
  title: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  icon?: React.ReactNode;
};

export default function Button({ ...ButtonProps }: ButtonProps) {
  return (
    <Pressable
      onPress={ButtonProps.onPress}
      disabled={ButtonProps.disabled}
      style={ButtonProps.style}
    >
      <View
        style={{
          flexDirection: "row",
          gap: 2,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {ButtonProps.icon}
        <Text style={ButtonProps.textStyle}>{ButtonProps.title}</Text>
      </View>
    </Pressable>
  );
}
