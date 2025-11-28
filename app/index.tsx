import { Redirect } from 'expo-router';
import { useAuthStore } from '../src/store/useAuthStore';

export default function Index() {
  const { user } = useAuthStore();
  
  // Redirect to login if not authenticated, otherwise to tabs
  if (!user) {
    return <Redirect href="/login" />;
  }
  
  return <Redirect href="/(tabs)" />;
}
