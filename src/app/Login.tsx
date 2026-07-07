import { useAuth } from "@/hooks/api/useAuth";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, signup, getStoredSession, isLoading, error } = useAuth();
  const [isSignUpPage, setIsSignUpPage] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const session = await getStoredSession();
      if (session?.token) {
        router.replace("/todo");
      }
    };

    checkSession();
  }, [getStoredSession]);

  const handleAuth = async (mode: "login" | "signup") => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Validation", "Email and password are required");
      return;
    }

    try {
      if (mode === "signup") {
        await signup(email.trim(), password);
      } else {
        await login(email.trim(), password);
      }
      router.replace("/todo");
    } catch (err: any) {
      Alert.alert(
        mode === "signup" ? "Signup failed" : "Login failed",
        err.message,
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F5F7FB] justify-center px-6">
      {/* Logo */}
      <Text className="text-4xl font-bold text-center text-[#62D2C3] mb-10">
        Welcome 👋
      </Text>

      {/* Card */}
      <View className="bg-white rounded-3xl p-6 shadow-lg">
        {/* Email */}
        <View className="mb-4">
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
        {/* <View className="flex-row justify-between mb-8">
          <Text className="text-gray-500">Remember me</Text>

          <Text className="text-[#62D2C3]">Forgot Password?</Text>
        </View> */}

        {error ? (
          <Text className="text-red-500 text-center mb-4">{error}</Text>
        ) : null}

        <Pressable
          onPress={() => handleAuth(isSignUpPage ? "signup" : "login")}
          disabled={isLoading}
          className="bg-[#62D2C3] rounded-full py-4 items-center active:opacity-80 mt-3"
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-lg font-semibold">
              {isSignUpPage ? "Sign Up" : "Login"}
            </Text>
          )}
        </Pressable>

        <View>
          {isSignUpPage ? (
            <View className="flex-row items-center justify-start mt-2 pl-2">
              <Text className="text-gray-500">Already have an account? </Text>

              <Pressable onPress={() => setIsSignUpPage((prev) => !prev)}>
                <Text className="text-blue-500 underline">Login</Text>
              </Pressable>
            </View>
          ) : (
            <View className="flex-row items-center justify-start mt-2 pl-2">
              <Text className="text-gray-500">Don't have an account? </Text>

              <Pressable onPress={() => setIsSignUpPage((prev) => !prev)}>
                <Text className="text-blue-500 underline">Sign Up</Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* <Pressable
          onPress={() => handleAuth("signup")}
          disabled={isLoading}
          className="border border-[#62D2C3] rounded-full py-4 items-center mt-3 active:opacity-80"
        >
          {isLoading ? (
            <ActivityIndicator color="#62D2C3" />
          ) : (
            <Text className="text-[#62D2C3] text-lg font-semibold">
              Create Account
            </Text>
          )}
        </Pressable> */}

        {/* Divider */}
        {/* <Text className="text-center text-gray-400 mt-5 mb-5">
          Or continue with
        </Text> */}

        {/* Google */}
        {/* <Pressable className="border border-gray-300 rounded-xl py-3 items-center flex-row justify-center">
          <Ionicons name="logo-google" size={22} color="#62D2C3" />
          <Text className="ml-3 text-base font-medium">
            Continue with Google
          </Text>
        </Pressable> */}
      </View>
    </SafeAreaView>
  );
}
