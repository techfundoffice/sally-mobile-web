import React from 'react';
import { View, StyleSheet } from 'react-native';
import { VideoGenerationForm } from '../../src/components/VideoGenerationForm';
import { Colors } from '../../src/constants/theme';

export default function CreateScreen() {
  return (
    <View style={styles.container}>
      <VideoGenerationForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
