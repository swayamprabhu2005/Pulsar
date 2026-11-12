import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { PulsarTheme } from '../../theme/theme';

export const SafeWalkScreen: React.FC = () => {
  const [sessionActive, setSessionActive] = useState(false);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>SafeWalk</Text>
      <Text style={styles.sub}>Live check-ins & trusted contact protection when travelling alone</Text>

      <View style={styles.panel}>
        <Text style={styles.statusTitle}>
          {sessionActive ? 'SafeWalk Session Active' : 'No Active Session'}
        </Text>
        <Text style={styles.statusDesc}>
          {sessionActive
            ? 'Trusted contacts can view your live location with your consent. Missed check-ins trigger an alert.'
            : 'Select trusted contacts and set an expected arrival time before you start walking.'}
        </Text>

        <TouchableOpacity
          style={[styles.btn, sessionActive && styles.btnEnd]}
          onPress={() => setSessionActive(!sessionActive)}
        >
          <Text style={styles.btnText}>
            {sessionActive ? 'Check In & End SafeWalk' : 'Start SafeWalk Session'}
          </Text>
        </TouchableOpacity>
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
  panel: {
    backgroundColor: PulsarTheme.colors.surfacePrimary,
    borderWidth: 1,
    borderColor: PulsarTheme.colors.surfaceBorder,
    borderRadius: PulsarTheme.radii.md,
    padding: PulsarTheme.spacing.lg,
    gap: PulsarTheme.spacing.md,
    marginTop: PulsarTheme.spacing.md,
  },
  statusTitle: {
    color: PulsarTheme.colors.textPrimary,
    fontSize: PulsarTheme.typography.sizes.lg,
    fontWeight: PulsarTheme.typography.weights.bold,
  },
  statusDesc: {
    color: PulsarTheme.colors.textSecondary,
    fontSize: PulsarTheme.typography.sizes.sm,
    lineHeight: 20,
  },
  btn: {
    backgroundColor: PulsarTheme.colors.accentPrimary,
    paddingVertical: 14,
    borderRadius: PulsarTheme.radii.md,
    alignItems: 'center',
  },
  btnEnd: {
    backgroundColor: PulsarTheme.colors.statusSuccess,
  },
  btnText: {
    color: PulsarTheme.colors.textPrimary,
    fontWeight: PulsarTheme.typography.weights.bold,
    fontSize: PulsarTheme.typography.sizes.base,
  },
});
