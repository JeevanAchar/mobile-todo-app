import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { height } = useWindowDimensions();

  const [todos, setTodos] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleAddTodo = () => {
    if (!inputValue.trim()) return;

    setTodos((prev) => [...prev, inputValue.trim()]);
    setInputValue("");
  };

  const handleDelete = (index: number) => {
    setTodos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditValue(todos[index]);
    setIsModalVisible(true);
  };

  const handleSave = () => {
    if (editingIndex === null || !editValue.trim()) return;

    const updated = [...todos];
    updated[editingIndex] = editValue.trim();

    setTodos(updated);

    setIsModalVisible(false);
    setEditingIndex(null);
    setEditValue("");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View
        className="flex flex-col items-center justify-end bg-[#62D2C3] relative"
        style={{ height: height * 0.16 }}
      >
        <Image
          source={require("../assests/RoundHeaderImage.png")}
          className="absolute -top-5 left-0"
        />
        <Text className="text-[22px] text-white font-bold pb-5">Welcome !</Text>
      </View>
      {/* Body */}
      <View className="flex flex-col" style={{ height: height * 0.84 }}>
        {/* Input Section */}
        <View className="p-4 w-full flex-row items-center gap-2">
          <TextInput
            className="outline-none p-3 px-4 text-base font-semibold text-gray-500
          active:ring-2 active:ring-[#62D2C3] rounded-lg border border-gray-300 flex-1"
            value={inputValue}
            onChangeText={setInputValue}
            placeholder="Enter a new todo..."
          />

          <Pressable
            onPress={handleAddTodo}
            className="bg-[#62D2C3] px-5 py-3 rounded-xl"
          >
            <Text className="text-white font-bold">Add</Text>
          </Pressable>
        </View>
        {/* Todo List Section */}
        {todos.length > 0 && (
          <Text className="px-5 text-[24px] font-semibold text-gray-500 underline mb-3">
            Todo's
          </Text>
        )}
        {/* Todo List */}
        <FlatList
          className="flex-1 px-4"
          data={todos}
          keyExtractor={(_, index) => index.toString()}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center mt-24">
              <MaterialIcons name="assignment" size={70} color="#d1d5db" />

              <Text className="text-gray-400 mt-4 text-lg">No todos yet</Text>

              <Text className="text-gray-400">Add one above 👆</Text>
            </View>
          }
          renderItem={({ item, index }) => (
            <View className="bg-white rounded-2xl border border-gray-200 p-4 mb-4 shadow-sm flex-row items-center">
              <Text className="flex-1 text-base font-semibold text-gray-700">
                {item}
              </Text>

              <View className="flex-row items-center">
                <Pressable
                  onPress={() => handleEdit(index)}
                  className="bg-blue-500 rounded-full p-2 mr-3"
                >
                  <MaterialIcons name="edit" color="white" size={20} />
                </Pressable>

                <Pressable
                  onPress={() => handleDelete(index)}
                  className="bg-red-500 rounded-full p-2"
                >
                  <MaterialIcons name="delete" color="white" size={20} />
                </Pressable>
              </View>
            </View>
          )}
        />

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
    </SafeAreaView>
  );
}
