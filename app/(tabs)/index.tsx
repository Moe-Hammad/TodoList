import useTheme from "@/hooks/useTheme";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const { toggleDarkMode } = useTheme();
  return (
    <View style={styles.container}>
      <Text style={styles.content}>dragon canolloni</Text>
      <TouchableOpacity onPress={toggleDarkMode}>
        <Text>toogle the mode</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
  },
  content: {
    fontSize: 45,
  },
});
