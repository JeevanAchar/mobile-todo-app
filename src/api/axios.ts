import axios from "axios";

const envConfig = process.env as Record<string, string | undefined>;
const configuredBaseUrl = envConfig.EXPO_PUBLIC_API_BASE_URL?.trim();
export const API_BASE_URL = configuredBaseUrl
  ? configuredBaseUrl.replace(/\/+$/, "")
  : "https://todo-server-ga5a.onrender.com";

export interface StoredAuthData {
  user_id?: string;
  email?: string;
  token: string;
}

export const AUTH_STORAGE_KEY = "todo_app_auth";

interface StorageLike {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
}

const memoryStore = new Map<string, string>();
let storageInstance: StorageLike | null = null;
let storageWarningShown = false;

const getStorage = () => {
  if (storageInstance) {
    return storageInstance;
  }

  try {
    const asyncStorageModule =
      require("@react-native-async-storage/async-storage") as
        { default?: Partial<StorageLike> } | Partial<StorageLike>;

    const asyncStorage =
      "default" in asyncStorageModule
        ? (asyncStorageModule.default ?? asyncStorageModule)
        : asyncStorageModule;
    const asyncStorageApi = asyncStorage as Partial<StorageLike>;

    if (
      typeof asyncStorageApi.getItem === "function" &&
      typeof asyncStorageApi.setItem === "function" &&
      typeof asyncStorageApi.removeItem === "function"
    ) {
      storageInstance = {
        getItem: async (key: string) => {
          try {
            return (await asyncStorageApi.getItem!(key)) ?? null;
          } catch (error) {
            if (!storageWarningShown) {
              console.warn("Falling back to in-memory storage:", error);
              storageWarningShown = true;
            }
            return memoryStore.get(key) ?? null;
          }
        },
        setItem: async (key: string, value: string) => {
          try {
            await asyncStorageApi.setItem!(key, value);
          } catch (error) {
            if (!storageWarningShown) {
              console.warn("Falling back to in-memory storage:", error);
              storageWarningShown = true;
            }
          }
          memoryStore.set(key, value);
        },
        removeItem: async (key: string) => {
          try {
            await asyncStorageApi.removeItem!(key);
          } catch (error) {
            if (!storageWarningShown) {
              console.warn("Falling back to in-memory storage:", error);
              storageWarningShown = true;
            }
          }
          memoryStore.delete(key);
        },
      };

      return storageInstance;
    }
  } catch (error) {
    if (!storageWarningShown) {
      console.warn(
        "Storage module unavailable; using in-memory fallback:",
        error,
      );
      storageWarningShown = true;
    }
  }

  storageInstance = {
    getItem: async (key: string) => memoryStore.get(key) ?? null,
    setItem: async (key: string, value: string) => {
      memoryStore.set(key, value);
    },
    removeItem: async (key: string) => {
      memoryStore.delete(key);
    },
  };

  return storageInstance;
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(async (config) => {
  const authData = await getStoredAuthData();

  if (authData?.token) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>).Authorization =
      `Bearer ${authData.token}`;
  }

  return config;
});

export const storeAuthData = async (authData: StoredAuthData) => {
  await getStorage().setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
};

export const getStoredAuthData = async (): Promise<StoredAuthData | null> => {
  const storedValue = await getStorage().getItem(AUTH_STORAGE_KEY);

  if (!storedValue) {
    return null;
  }

  try {
    return JSON.parse(storedValue) as StoredAuthData;
  } catch {
    return null;
  }
};

export const clearStoredAuthData = async () => {
  await getStorage().removeItem(AUTH_STORAGE_KEY);
};
