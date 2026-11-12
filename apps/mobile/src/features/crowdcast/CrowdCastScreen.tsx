import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { PulsarTheme } from '../../theme/theme';

export const CrowdCastScreen: React.FC = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>CrowdCast</Text>
      <Text style={styles.sub}>Offline-capable event & public safety broadcasts (Signed Ed25519)</Text>
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Local Broadcast Relay Ready</Text>
        <Text style={styles.infoDesc}>
          Subscribe to verified campus, festival, or municipal disaster channels. Cached broadcasts automatically propagate via nearby Pulsar devices when internet is down.
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
  infoBox: {
    backgroundColor: PulsarTheme.colors.surfacePrimary,
    borderWidth: 1,
    borderColor: PulsarTheme.colors.surfaceBorder,
    borderRadius: PulsarTheme.radii.md,
    padding: PulsarTheme.spacing.lg,
    marginTop: PulsarTheme.spacing.md,
  },
  infoTitle: {
    color: PulsarTheme.colors.accentCyan,
    fontWeight: PulsarTheme.typography.weights.bold,
    fontSize: PulsarTheme.typography.sizes.base,
  },
  infoDesc: {
    color: PulsarTheme.colors.textSecondary,
    fontSize: PulsarTheme.typography.sizes.sm,
    marginTop: 6,
    lineHeight: 20,
  },
});
