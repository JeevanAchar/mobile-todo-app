import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Test() {
  return (
    <SafeAreaView>
      <Text>IOS device</Text>
    </SafeAreaView>
  );
}

// A simple usage of the two different platform
// const RenderBasedOnPlatform = () => {
//   if (Platform.OS === "android") {
//     return <TestAndroid />;
//   } else {
//     return <TestIos />;
//   }
// };
//File Extensions appending .android. or .ios. to your file names, allowing React Native to automatically load the appropriate file based on the platform.
