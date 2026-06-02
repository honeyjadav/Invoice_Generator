import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import React from 'react';

export default function SafeAreaWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.innerContainer} showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4FF',
  },
  innerContainer: {
    padding: 20,
    paddingBottom: 60,
  },
});