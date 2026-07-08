import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Test() {
  return (
    <SafeAreaView>
      <Text className="text-red-700 text-2xl">Android device</Text>
    </SafeAreaView>
  );
}
