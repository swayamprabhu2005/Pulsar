import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { PulsarTheme } from '../../theme/theme';

export const HomeScreen: React.FC<{ userName: string }> = ({ userName }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <Image source={require('../../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
        <View>
          <Text style={styles.greeting}>Welcome, {userName}</Text>
          <Text style={styles.subtitle}>Pulsar Community Safety Network</Text>
        </View>
      </View>

      <View style={styles.statusGrid}>
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Bluetooth Mesh</Text>
          <Text style={[styles.metricValue, { color: PulsarTheme.colors.transportBle }]}>Ready (Android BLE)</Text>
        </View>
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Internet Link</Text>
          <Text style={[styles.metricValue, { color: PulsarTheme.colors.transportInternet }]}>Connected</Text>
        </View>
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Nearby Nodes</Text>
          <Text style={styles.metricValue}>0 Discovered</Text>
        </View>
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Offline Queue</Text>
          <Text style={styles.metricValue}>0 Pending</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: PulsarTheme.colors.canvas,
    padding: PulsarTheme.spacing.lg,
    gap: PulsarTheme.spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: PulsarTheme.spacing.md,
  },
  logo: {
    width: 44,
    height: 50,
  },
  greeting: {
    color: PulsarTheme.colors.textPrimary,
    fontSize: PulsarTheme.typography.sizes.xl,
    fontWeight: PulsarTheme.typography.weights.bold,
  },
  subtitle: {
    color: PulsarTheme.colors.textSecondary,
    fontSize: PulsarTheme.typography.sizes.xs,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: PulsarTheme.spacing.md,
  },
  metricBox: {
    width: '47%',
    backgroundColor: PulsarTheme.colors.surfacePrimary,
    borderWidth: 1,
    borderColor: PulsarTheme.colors.surfaceBorder,
    borderRadius: PulsarTheme.radii.md,
    padding: PulsarTheme.spacing.md,
  },
  metricLabel: {
    color: PulsarTheme.colors.textSecondary,
    fontSize: PulsarTheme.typography.sizes.xs,
  },
  metricValue: {
    color: PulsarTheme.colors.textPrimary,
    fontSize: PulsarTheme.typography.sizes.sm,
    fontWeight: PulsarTheme.typography.weights.bold,
    marginTop: 6,
  },
});
