import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Important: This is required for web browser to close properly after auth
WebBrowser.maybeCompleteAuthSession();

const AUTH_STORAGE_KEY = 'sally_auth_user';
const TOKEN_STORAGE_KEY = 'sally_auth_token';

// Google OAuth Configuration
const GOOGLE_CLIENT_ID = '374629129804-tm95k8gioipthqkmihl6ct42s8f9c38s.apps.googleusercontent.com';
const REDIRECT_URI = AuthSession.makeRedirectUri({
  scheme: 'sally-mobile',
  path: 'auth',
});

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  provider: 'google' | 'email' | 'phone';
}

export interface AuthToken {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
}

class AuthService {
  private discovery = {
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
    revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
  };

  // Google OAuth Sign In
  async signInWithGoogle(): Promise<AuthUser> {
    try {
      // Create OAuth request
      const redirectUri = REDIRECT_URI;
      const authUrl = `${this.discovery.authorizationEndpoint}?` +
        `client_id=${encodeURIComponent(GOOGLE_CLIENT_ID)}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `response_type=token&` +
        `scope=${encodeURIComponent('openid profile email')}`;

      // Open OAuth flow in popup/redirect
      if (typeof window !== 'undefined') {
        window.location.href = authUrl;
      }

      // This will be handled by the callback
      // For now, return mock user (will be replaced by real user from callback)
      const mockUser: AuthUser = {
        id: `google_${Date.now()}`,
        email: 'user@example.com',
        name: 'Sally User',
        picture: 'https://i.pravatar.cc/150?img=50',
        provider: 'google',
      };

      await this.saveUser(mockUser);
      await this.saveToken({
        accessToken: `mock_token_${Date.now()}`,
        expiresAt: Date.now() + 3600000,
      });

      return mockUser;
    } catch (error) {
      console.error('Google sign in error:', error);
      throw new Error('Failed to sign in with Google');
    }
  }

  // Email Sign In (for future implementation)
  async signInWithEmail(email: string, password: string): Promise<AuthUser> {
    // Simulate email sign in
    const mockUser: AuthUser = {
      id: `email_${Date.now()}`,
      email,
      name: email.split('@')[0],
      provider: 'email',
    };

    await this.saveUser(mockUser);
    await this.saveToken({
      accessToken: `mock_token_${Date.now()}`,
      expiresAt: Date.now() + 3600000,
    });

    return mockUser;
  }

  // Phone Sign In (for future implementation)
  async signInWithPhone(phoneNumber: string): Promise<AuthUser> {
    const mockUser: AuthUser = {
      id: `phone_${Date.now()}`,
      email: `${phoneNumber}@phone.sally.app`,
      name: phoneNumber,
      provider: 'phone',
    };

    await this.saveUser(mockUser);
    await this.saveToken({
      accessToken: `mock_token_${Date.now()}`,
      expiresAt: Date.now() + 3600000,
    });

    return mockUser;
  }

  // Sign Out
  async signOut(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([AUTH_STORAGE_KEY, TOKEN_STORAGE_KEY]);
    } catch (error) {
      console.error('Sign out error:', error);
      throw new Error('Failed to sign out');
    }
  }

  // Get Current User
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const userJson = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (!userJson) return null;

      const user: AuthUser = JSON.parse(userJson);
      
      // Check if token is still valid
      const tokenJson = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
      if (!tokenJson) return null;

      const token: AuthToken = JSON.parse(tokenJson);
      if (token.expiresAt < Date.now()) {
        // Token expired, sign out
        await this.signOut();
        return null;
      }

      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user !== null;
  }

  // Save user to storage
  private async saveUser(user: AuthUser): Promise<void> {
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  }

  // Save token to storage
  private async saveToken(token: AuthToken): Promise<void> {
    await AsyncStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(token));
  }

  // Get stored token
  async getToken(): Promise<string | null> {
    try {
      const tokenJson = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
      if (!tokenJson) return null;

      const token: AuthToken = JSON.parse(tokenJson);
      if (token.expiresAt < Date.now()) {
        return null;
      }

      return token.accessToken;
    } catch (error) {
      return null;
    }
  }
}

export const authService = new AuthService();
