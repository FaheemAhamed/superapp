import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useStore = create(
  persist(
    (set, get) => ({
      users: [], // local DB of registered users
      activeUser: null, // current logged-in user
      categories: [],
      notes: [],

      // Auth actions
      register: (user) => {
        set((state) => {
          // Check if user already exists
          const exists = state.users.find(u => u.username === user.username || u.email === user.email);
          if (exists) return state; // handled by form validation preferably
          return {
            users: [...state.users, user],
            activeUser: user,
            categories: [], // reset for new user
            notes: [],
          };
        });
      },
      login: (username, password) => {
        const state = get();
        const user = state.users.find(
          (u) => (u.username === username || u.email === username) && u.password === password
        );
        if (user) {
          set({ activeUser: user });
          return true;
        }
        return false;
      },
      logout: () => {
        set({ activeUser: null, categories: [], notes: [] });
      },

      // Existing actions adapted for activeUser
      setUser: (user) => set({ activeUser: user }),
      setCategories: (categories) => set({ categories }),
      addNote: (text) =>
        set((s) => ({
          notes: [{ id: crypto.randomUUID(), text, createdAt: Date.now() }, ...s.notes],
        })),
      updateNote: (id, text) =>
        set((s) => ({ notes: s.notes.map((n) => (n.id === id ? { ...n, text } : n)) })),
      deleteNote: (id) => set((s) => ({ notes: s.notes.filter((n) => n.id !== id) })),
      reset: () => set({ activeUser: null, categories: [], notes: [] }),
    }),
    { name: "super-app-store" },
  ),
);
