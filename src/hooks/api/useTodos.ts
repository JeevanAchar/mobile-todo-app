import { API_ROUTES } from "@/api/Routes";
import { apiClient } from "@/api/axios";
import { useCallback, useState } from "react";

interface TodoItem {
  todo_id: string;
  todo: string;
  createdAt: string;
}

interface TodoApiResponse {
  success: boolean;
  message: string;
  data?: TodoItem | TodoItem[];
}

export const useTodos = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<TodoApiResponse>(
        API_ROUTES.todo.getAll,
      );
      const payload = response.data;

      if (!payload.success) {
        throw new Error(payload.message || "Failed to fetch todos");
      }

      const items = Array.isArray(payload.data) ? payload.data : [];
      setTodos(items);
      return items;
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || "Failed to fetch todos";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTodo = useCallback(async (todo: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.post<TodoApiResponse>(
        API_ROUTES.todo.add,
        { todo },
      );
      const payload = response.data;

      if (!payload.success) {
        throw new Error(payload.message || "Failed to create todo");
      }

      const createdTodo = payload.data as TodoItem;
      setTodos((current) => [createdTodo, ...current]);
      return createdTodo;
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || "Failed to create todo";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateTodo = useCallback(async (todoId: string, todo: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.put<TodoApiResponse>(
        API_ROUTES.todo.update(todoId),
        { todo },
      );
      const payload = response.data;

      if (!payload.success) {
        throw new Error(payload.message || "Failed to update todo");
      }

      const updatedTodo = payload.data as TodoItem;
      setTodos((current) =>
        current.map((item) => (item.todo_id === todoId ? updatedTodo : item)),
      );
      return updatedTodo;
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || "Failed to update todo";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteTodo = useCallback(async (todoId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await apiClient.delete(API_ROUTES.todo.delete(todoId));
      setTodos((current) => current.filter((item) => item.todo_id !== todoId));
      return true;
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || "Failed to delete todo";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    todos,
    isLoading,
    error,
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    setTodos,
  };
};
