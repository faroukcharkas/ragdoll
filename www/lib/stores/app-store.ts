import { createStore } from "zustand/vanilla";

export type UserState = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

export type AppState = {
  user: UserState | null;
};

export const useAppStore = createStore<AppState>((set) => ({
  user: null,
}));