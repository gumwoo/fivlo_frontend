// src/components/common/ScreenContainer.jsx
import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../styles/color';

const ScreenContainer = ({ children, scroll = false, style, contentContainerStyle }) => {
  const Container = scroll ? ScrollView : View;
  return (
    <SafeAreaView style={styles.safe}>
      <Container style={[styles.container, style]} contentContainerStyle={contentContainerStyle}>
        {children}
      </Container>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.primaryBeige },
  container: { flex: 1, backgroundColor: Colors.primaryBeige },
});

export default ScreenContainer;

