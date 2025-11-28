import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../src/store/useAuthStore';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights } from '../src/constants/theme';

export default function LoginScreen() {
  const router = useRouter();
  const { signInWithGoogle, signInWithEmail, signInWithPhone, isLoading, error } = useAuthStore();
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [showPhoneInput, setShowPhoneInput] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      // Navigate to home after successful sign in
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to sign in with Google');
    }
  };

  const handleEmailContinue = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    try {
      await signInWithEmail(email.trim(), 'demo_password');
      // Navigate to home after successful sign in
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to sign in with email');
    }
  };

  const handlePhoneSignIn = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    try {
      await signInWithPhone(phoneNumber.trim());
      // Navigate to home after successful sign in
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to sign in with phone');
    }
  };

  return (
    <View style={styles.container}>
      {/* Sally Logo */}
      <View style={styles.logoContainer}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>⚡</Text>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>Log in or sign up</Text>
      <Text style={styles.subtitle}>
        You'll get smarter responses and can upload files, images and more.
      </Text>

      {/* Email Input */}
      {!showPhoneInput && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={Colors.textTertiary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            onFocus={() => setShowEmailInput(true)}
          />
        </View>
      )}

      {/* Continue Button */}
      {showEmailInput && !showPhoneInput && (
        <TouchableOpacity
          style={[styles.continueButton, !email.trim() && styles.continueButtonDisabled]}
          onPress={handleEmailContinue}
          disabled={!email.trim() || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={Colors.text} />
          ) : (
            <Text style={styles.continueButtonText}>Continue</Text>
          )}
        </TouchableOpacity>
      )}

      {/* Divider */}
      {!showPhoneInput && (
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>
      )}

      {/* Google Sign In */}
      {!showPhoneInput && (
        <TouchableOpacity
          style={styles.socialButton}
          onPress={handleGoogleSignIn}
          disabled={isLoading}
        >
          <Text style={styles.googleIcon}>G</Text>
          <Text style={styles.socialButtonText}>Continue with Google</Text>
        </TouchableOpacity>
      )}

      {/* Phone Sign In */}
      {!showEmailInput && (
        <>
          {showPhoneInput ? (
            <View style={styles.phoneContainer}>
              <TextInput
                style={styles.input}
                placeholder="Phone number"
                placeholderTextColor={Colors.textTertiary}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                autoFocus
              />
              <TouchableOpacity
                style={[styles.continueButton, !phoneNumber.trim() && styles.continueButtonDisabled]}
                onPress={handlePhoneSignIn}
                disabled={!phoneNumber.trim() || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={Colors.text} />
                ) : (
                  <Text style={styles.continueButtonText}>Continue</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => {
                  setShowPhoneInput(false);
                  setPhoneNumber('');
                }}
              >
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => setShowPhoneInput(true)}
              disabled={isLoading}
            >
              <Text style={styles.phoneIcon}>📱</Text>
              <Text style={styles.socialButtonText}>Continue with phone</Text>
            </TouchableOpacity>
          )}
        </>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity>
          <Text style={styles.footerLink}>Terms of Use</Text>
        </TouchableOpacity>
        <Text style={styles.footerDot}> · </Text>
        <TouchableOpacity>
          <Text style={styles.footerLink}>Privacy Policy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.xl,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 40,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: Spacing.md,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md + 4,
    fontSize: FontSizes.md,
    color: Colors.text,
  },
  continueButton: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.md + 4,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
    marginHorizontal: Spacing.md,
  },
  socialButton: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md + 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  socialButtonText: {
    color: Colors.text,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    marginLeft: Spacing.sm,
  },
  googleIcon: {
    fontSize: 20,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  phoneIcon: {
    fontSize: 20,
  },
  phoneContainer: {
    marginTop: Spacing.md,
  },
  backButton: {
    padding: Spacing.md,
    alignItems: 'center',
  },
  backButtonText: {
    color: Colors.primary,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  footerLink: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
    textDecorationLine: 'underline',
  },
  footerDot: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
  },
});
