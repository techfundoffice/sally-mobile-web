import { create } from 'zustand';
import { authService, AuthUser } from '../services/auth';

interface AuthStore {
  user: AuthUser | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  // Actions
  initialize: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithPhone: (phoneNumber: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isLoading: false,
  isInitialized: false,
  error: null,

  initialize: async () => {
    try {
      set({ isLoading: true });
      const user = await authService.getCurrentUser();
      set({ user, isInitialized: true, isLoading: false });
    } catch (error: any) {
      console.error('Auth initialization error:', error);
      set({ user: null, isInitialized: true, isLoading: false });
    }
  },

  signInWithGoogle: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.signInWithGoogle();
      set({ user, isLoading: false, error: null });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to sign in with Google',
        isLoading: false,
      });
      throw error;
    }
  },

  signInWithEmail: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.signInWithEmail(email, password);
      set({ user, isLoading: false, error: null });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to sign in with email',
        isLoading: false,
      });
      throw error;
    }
  },

  signInWithPhone: async (phoneNumber: string) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.signInWithPhone(phoneNumber);
      set({ user, isLoading: false, error: null });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to sign in with phone',
        isLoading: false,
      });
      throw error;
    }
  },

  signOut: async () => {
    set({ isLoading: true, error: null });
    try {
      await authService.signOut();
      set({ user: null, isLoading: false, error: null });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to sign out',
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
