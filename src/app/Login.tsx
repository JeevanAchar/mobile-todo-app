import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-[#F5F7FB] justify-center px-6">
      {/* Logo */}
      <Text className="text-4xl font-bold text-center text-[#62D2C3] mb-10">
        Todoist
      </Text>

      {/* Card */}
      <View className="bg-white rounded-3xl p-6 shadow-lg">
        <Text className="text-3xl font-bold text-center">Welcome 👋</Text>

        <Text className="text-center text-gray-500 mt-2 mb-8">
          Login to continue
        </Text>

        {/* Email */}
        <View className="mb-5">
          <Text className="text-gray-700 font-semibold mb-2">Email</Text>

          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="example@gmail.com"
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#4B5563"
            className="bg-gray-100 rounded-xl px-4 py-4 text-base text-gray-500"
          />
        </View>

        {/* Password */}
        <View className="mb-3">
          <Text className="text-gray-700 font-semibold mb-2">Password</Text>

          <View className="flex-row items-center bg-gray-100 rounded-xl px-4">
            <TextInput
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor="#4B5563"
              className="flex-1 py-4 text-gray-500"
            />

            <Pressable
              onPress={() => {
                setShowPassword((prev) => !prev);
              }}
            >
              <Ionicons
                name={showPassword ? "eye" : "eye-off-outline"}
                size={22}
                color="gray"
              />
            </Pressable>
          </View>
        </View>

        {/* Remember + Forgot */}
        <View className="flex-row justify-between mb-8">
          <Text className="text-gray-500">Remember me</Text>

          <Text className="text-[#62D2C3]">Forgot Password?</Text>
        </View>

        {/* Login */}
        <Pressable
          onPress={() => router.replace("/todo")}
          className="bg-[#62D2C3] rounded-full py-4 items-center active:opacity-80"
        >
          <Text className="text-white text-lg font-semibold">Login</Text>
        </Pressable>

        {/* Divider */}
        <Text className="text-center text-gray-400 mt-5 mb-5">
          Or continue with
        </Text>

        {/* Google */}
        <Pressable className="border border-gray-300 rounded-xl py-3 items-center flex-row justify-center">
          <Ionicons name="logo-google" size={22} color="#62D2C3" />
          <Text className="ml-3 text-base font-medium">
            Continue with Google
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
