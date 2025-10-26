import { createHomeStyles } from "@/assets/styles/home.style";
import EmptyState from "@/component/EmptyState";
import Header from "@/component/Header";
import LoadingSpinner from "@/component/LoadingSpinner";
import TodoInput from "@/component/TodoInput";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import useTheme from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import {
  Alert,
  FlatList,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Todo = Doc<"todos">;

export default function Index() {
  const { toggleDarkMode, colors } = useTheme();

  const homestyle = createHomeStyles(colors);
  const todos = useQuery(api.todos.getTodos);
  const toggleTodo = useMutation(api.todos.toggleTodo);
  const deleteTodo = useMutation(api.todos.deleteTodo);
  const isLoading = todos === undefined;

  const handleDeleteTodo = async (id: Id<"todos">) => {
    try {
      Alert.alert("Delete Todo", "Do you want to Delete Todo?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => await deleteTodo({ id }),
        },
      ]);
    } catch (error) {
      console.log("Error cant toggle", error);
      Alert.alert("Error", "Failed to Delete");
    }
  };

  const handleToggleTodo = async (id: Id<"todos">) => {
    try {
      await toggleTodo({ id });
    } catch (error) {
      console.log("Error cant toggle", error);
      Alert.alert("Error", "Failed to toggle");
    }
  };

  const renderTodoItem = ({ item }: { item: Todo }) => (
    <View style={homestyle.todoItemWrapper}>
      <LinearGradient
        colors={colors.gradients.surface}
        style={homestyle.todoItem}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity
          style={homestyle.checkbox}
          activeOpacity={0.7}
          onPress={() => handleToggleTodo(item._id)}
        >
          <LinearGradient
            colors={
              item.isCompleted
                ? colors.gradients.success
                : colors.gradients.muted
            }
            style={[
              homestyle.checkboxInner,
              { borderColor: item.isCompleted ? "transparent" : colors.border },
            ]}
          >
            {item.isCompleted && (
              <Ionicons name="checkmark" size={18} color={"#fff"}></Ionicons>
            )}
          </LinearGradient>
        </TouchableOpacity>
        <View style={homestyle.todoTextContainer}>
          <Text
            style={[
              homestyle.todoText,
              item.isCompleted && {
                textDecorationLine: "line-through",
                color: colors.textMuted,
                opacity: 0.6,
              },
            ]}
          >
            {item.text}
          </Text>
          <View style={homestyle.todoActions}>
            <TouchableOpacity onPress={() => {}} activeOpacity={0.8}>
              <LinearGradient
                colors={colors.gradients.warning}
                style={homestyle.actionButton}
              >
                <Ionicons name="pencil" size={14} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDeleteTodo(item._id)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={colors.gradients.danger}
                style={homestyle.actionButton}
              >
                <Ionicons name="trash" size={14} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <LinearGradient
      colors={colors.gradients.background}
      style={homestyle.container}
    >
      <StatusBar barStyle={colors.statusBarStyle} />
      <SafeAreaView style={homestyle.container}>
        <Header />
        <TodoInput />
        <FlatList
          data={todos}
          renderItem={renderTodoItem}
          keyExtractor={(item) => item._id}
          style={homestyle.todoList}
          contentContainerStyle={homestyle.todoListContent}
          ListEmptyComponent={<EmptyState />}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}
