export const API_ROUTES = {
  auth: {
    login: "/v1/api/login",
    signup: "/v1/api/signup",
  },
  todo: {
    getAll: "/v1/api/todo",
    add: "/v1/api/todo",
    update: (todoId: string) => `/v1/api/todo/${todoId}`,
    delete: (todoId: string) => `/v1/api/todo/${todoId}`,
  },
} as const;
