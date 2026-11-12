import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { PulsarTheme } from '../../theme/theme';

export const MessagesScreen: React.FC = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>MeshChat</Text>
      <Text style={styles.sub}>End-to-end encrypted private & group messaging (Internet + BLE Mesh)</Text>
      <View style={styles.emptyBox}>
        <Text style={styles.emptyTitle}>No conversations yet</Text>
        <Text style={styles.emptyDesc}>
          Sync your contacts (opt-in) to see who is already on Pulsar, or invite contacts via SMS.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: PulsarTheme.colors.canvas,
    padding: PulsarTheme.spacing.lg,
    gap: PulsarTheme.spacing.md,
  },
  header: {
    fontSize: PulsarTheme.typography.sizes.xxl,
    fontWeight: PulsarTheme.typography.weights.bold,
    color: PulsarTheme.colors.textPrimary,
  },
  sub: {
    color: PulsarTheme.colors.textSecondary,
    fontSize: PulsarTheme.typography.sizes.xs,
  },
  emptyBox: {
    backgroundColor: PulsarTheme.colors.surfacePrimary,
    borderWidth: 1,
    borderColor: PulsarTheme.colors.surfaceBorder,
    borderRadius: PulsarTheme.radii.md,
    padding: PulsarTheme.spacing.lg,
    marginTop: PulsarTheme.spacing.md,
  },
  emptyTitle: {
    color: PulsarTheme.colors.textPrimary,
    fontWeight: PulsarTheme.typography.weights.bold,
    fontSize: PulsarTheme.typography.sizes.base,
  },
  emptyDesc: {
    color: PulsarTheme.colors.textSecondary,
    fontSize: PulsarTheme.typography.sizes.sm,
    marginTop: 6,
    lineHeight: 20,
  },
});
