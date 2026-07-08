import { useAuth } from "@/hooks/api/useAuth";
import { useTodos } from "@/hooks/api/useTodos";
import { showNotification } from "@/services/NotificationService";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { height } = useWindowDimensions();
  const { logout, getStoredSession } = useAuth();
  const {
    todos,
    isLoading,
    error,
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
  } = useTodos();

  const [inputValue, setInputValue] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const bootstrap = async () => {
      const session = await getStoredSession();
      if (!session?.token) {
        router.replace("/Login");
        return;
      }

      try {
        await fetchTodos();
      } catch {
        // errors are surfaced via the hook state
      }
    };

    bootstrap();
  }, [fetchTodos, getStoredSession]);

  useEffect(() => {
    const keyboardDidShow = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const keyboardDidHide = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        return true;
      },
    );

    return () => {
      keyboardDidShow.remove();
      keyboardDidHide.remove();
      backHandler.remove();
    };
  }, []);

  const handleAddTodo = async () => {
    if (!inputValue.trim()) return;

    try {
      const todoText = inputValue.trim();

      await createTodo(todoText);

      await showNotification({
        title: "Todo Added ✅",
        body: `"${todoText}" has been added successfully.`,
      });

      setInputValue("");
    } catch (err: any) {
      Alert.alert("Unable to add todo", err.message);
    }
  };

  const handleDelete = async (todoId: string) => {
    try {
      await deleteTodo(todoId);
    } catch (err: any) {
      Alert.alert("Unable to delete todo", err.message);
    }
  };

  const handleEdit = (todoId: string, currentValue: string) => {
    setEditingId(todoId);
    setEditValue(currentValue);
    setIsModalVisible(true);
  };

  const handleSave = async () => {
    if (!editingId || !editValue.trim()) return;

    try {
      await updateTodo(editingId, editValue.trim());
      setIsModalVisible(false);
      setEditingId(null);
      setEditValue("");
    } catch (err: any) {
      Alert.alert("Unable to update todo", err.message);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/Login");
  };

  const onRefresh = useCallback(() => {
    (async () => {
      setRefreshing(true);
      try {
        await fetchTodos();
      } catch {
        // errors are surfaced via the hook state
      } finally {
        setRefreshing(false);
      }
    })();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {/* Header */}
        <View
          className="flex flex-col items-center justify-end bg-[#62D2C3] relative"
          style={{ height: height * 0.15 }}
        >
          <Image
            source={require("../assests/RoundHeaderImage.png")}
            className="absolute -top-5 left-0"
          />
          <View className="absolute top-4 right-4">
            <Pressable onPress={handleLogout}>
              <Text className="text-white underline font-semibold">Logout</Text>
            </Pressable>
          </View>
          <Text className="text-[22px] text-white font-bold pb-5 text-left w-full pl-5">
            Welcome !
          </Text>
        </View>

        {/* Body */}
        <View className="flex-1 flex-col">
          {error ? (
            <Text className="px-5 text-red-500 mb-3">{error}</Text>
          ) : null}
          {/* Todo List Section */}
          {todos.length > 0 && (
            <Text className="px-5 text-[24px] font-semibold text-gray-500 underline mb-3 mt-2">
              Todo's
            </Text>
          )}
          {/* Todo List */}
          <FlatList
            className="flex-1 px-4"
            data={todos}
            keyExtractor={(item) => item.todo_id}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            contentContainerStyle={{
              paddingBottom: keyboardHeight > 0 ? keyboardHeight + 24 : 24,
            }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <View className="flex-1 justify-center items-center mt-24">
                <MaterialIcons name="assignment" size={70} color="#d1d5db" />

                <Text className="text-gray-400 mt-4 text-lg">No todos yet</Text>
              </View>
            }
            renderItem={({ item }) => (
              <View className="bg-white rounded-2xl border border-gray-200 p-4 mb-4 shadow-sm flex-row items-center">
                <Text className="flex-1 text-base font-semibold text-gray-700">
                  {item.todo}
                </Text>

                <View className="flex-row items-center">
                  <Pressable
                    onPress={() => handleEdit(item.todo_id, item.todo)}
                    className="bg-blue-500 rounded-full p-2 mr-3"
                  >
                    <MaterialIcons name="edit" color="white" size={20} />
                  </Pressable>

                  <Pressable
                    onPress={() => handleDelete(item.todo_id)}
                    className="bg-red-500 rounded-full p-2"
                  >
                    <MaterialIcons name="delete" color="white" size={20} />
                  </Pressable>
                </View>
              </View>
            )}
          />

          {/* Input Section */}
          <View
            className="px-4 py-3 w-full flex-row items-center gap-2 border-t border-gray-100 bg-white"
            style={{
              paddingBottom: keyboardHeight > 0 ? keyboardHeight + 12 : 12,
            }}
          >
            <TextInput
              className="outline-none p-3 px-4 text-base font-semibold text-gray-500
          active:ring-2 active:ring-[#62D2C3] rounded-lg border border-gray-300 flex-1"
              value={inputValue}
              onChangeText={setInputValue}
              placeholder="Enter a new todo..."
              returnKeyType="done"
              blurOnSubmit={false}
            />

            <Pressable
              onPress={handleAddTodo}
              disabled={isLoading}
              className="bg-[#62D2C3] px-5 py-3 rounded-xl"
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold">Add</Text>
              )}
            </Pressable>
          </View>

          {/* Edit Modal */}
          <Modal visible={isModalVisible} transparent animationType="fade">
            <View className="flex-1 bg-black/50 justify-center items-center px-6">
              <View className="bg-white w-full rounded-2xl p-6">
                <Text className="text-2xl font-bold mb-5">Edit Todo</Text>

                <TextInput
                  value={editValue}
                  onChangeText={setEditValue}
                  className="border border-gray-300 rounded-xl px-4 py-3 text-base outline-none"
                />

                <View className="flex-row justify-end mt-6">
                  <Pressable
                    onPress={() => setIsModalVisible(false)}
                    className="bg-gray-300 rounded-xl px-5 py-3 mr-3"
                  >
                    <Text className="font-semibold">Cancel</Text>
                  </Pressable>

                  <Pressable
                    onPress={handleSave}
                    className="bg-[#62D2C3] rounded-xl px-5 py-3"
                  >
                    <Text className="text-white font-semibold">Save</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
