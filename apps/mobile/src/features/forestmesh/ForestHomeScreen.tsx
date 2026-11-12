import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { PulsarTheme } from '../../theme/theme';

export const ForestHomeScreen: React.FC<{ userName: string; role: string; zone: string }> = ({
  userName,
  role,
  zone,
}) => {
  const [relays] = useState([
    { id: 'RELAY-01', location: 'Ridge Top Station (Solar)', battery: 98, status: 'ONLINE', hops: 1 },
    { id: 'RELAY-02', location: 'River Valley Point', battery: 84, status: 'ONLINE', hops: 2 },
    { id: 'RELAY-03', location: 'Deep Canyon Pass (LoRa)', battery: 42, status: 'DEGRADED', hops: 3 },
  ]);

  const handleWildfireAlert = () => {
    Alert.alert('Simulate Wildfire Alert', 'Broadcast priority CRITICAL packet to all rangers and relay nodes?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Broadcast SOS', style: 'destructive' },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.zoneBadge}>{zone}</Text>
        <Text style={styles.greeting}>{userName}</Text>
        <Text style={styles.roleText}>{role} • Field Mesh Active</Text>
      </View>

      <TouchableOpacity style={styles.wildfireBtn} onPress={handleWildfireAlert}>
        <Text style={styles.wildfireTitle}>EMERGENCY FOREST DISPATCH</Text>
        <Text style={styles.wildfireSub}>Wildfire • Wildlife Threat • Missing Tourist</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Active ESP32 / LoRa Relays ({relays.length})</Text>
      <View style={styles.relaysList}>
        {relays.map((relay) => (
          <View key={relay.id} style={styles.relayBox}>
            <View style={styles.relayRow}>
              <Text style={styles.relayId}>{relay.id}</Text>
              <Text style={[styles.relayStatus, relay.status === 'ONLINE' ? styles.statusGreen : styles.statusAmber]}>
                {relay.status}
              </Text>
            </View>
            <Text style={styles.relayLoc}>{relay.location}</Text>
            <Text style={styles.relayMeta}>Battery: {relay.battery}% • Mesh Hops: {relay.hops}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#060E0A',
    padding: PulsarTheme.spacing.lg,
    gap: PulsarTheme.spacing.md,
  },
  header: {
    gap: 4,
  },
  zoneBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#13231B',
    borderColor: '#10B981',
    borderWidth: 1,
    color: '#34D399',
    fontSize: PulsarTheme.typography.sizes.xs,
    fontWeight: PulsarTheme.typography.weights.bold,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: PulsarTheme.radii.xs,
  },
  greeting: {
    color: PulsarTheme.colors.textPrimary,
    fontSize: PulsarTheme.typography.sizes.xxl,
    fontWeight: PulsarTheme.typography.weights.bold,
    marginTop: 4,
  },
  roleText: {
    color: '#94A3B8',
    fontSize: PulsarTheme.typography.sizes.xs,
  },
  wildfireBtn: {
    backgroundColor: '#DC2626',
    borderRadius: PulsarTheme.radii.md,
    padding: PulsarTheme.spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F87171',
    marginVertical: 4,
  },
  wildfireTitle: {
    color: '#FFFFFF',
    fontWeight: PulsarTheme.typography.weights.heavy,
    fontSize: PulsarTheme.typography.sizes.base,
    letterSpacing: 1,
  },
  wildfireSub: {
    color: '#FEE2E2',
    fontSize: PulsarTheme.typography.sizes.xs,
    marginTop: 4,
  },
  sectionTitle: {
    color: PulsarTheme.colors.textPrimary,
    fontSize: PulsarTheme.typography.sizes.base,
    fontWeight: PulsarTheme.typography.weights.bold,
    marginTop: 8,
  },
  relaysList: {
    gap: 8,
  },
  relayBox: {
    backgroundColor: '#0D1A14',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: PulsarTheme.radii.md,
    padding: 12,
  },
  relayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  relayId: {
    color: '#34D399',
    fontWeight: PulsarTheme.typography.weights.bold,
    fontSize: PulsarTheme.typography.sizes.sm,
  },
  relayStatus: {
    fontSize: PulsarTheme.typography.sizes.xs,
    fontWeight: PulsarTheme.typography.weights.bold,
  },
  statusGreen: {
    color: '#10B981',
  },
  statusAmber: {
    color: '#F59E0B',
  },
  relayLoc: {
    color: PulsarTheme.colors.textPrimary,
    fontSize: PulsarTheme.typography.sizes.xs,
    marginTop: 4,
  },
  relayMeta: {
    color: '#64748B',
    fontSize: PulsarTheme.typography.sizes.xs,
    marginTop: 2,
  },
});
