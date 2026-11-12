import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Linking, Alert } from 'react-native';
import { getEmergencyNumbers } from '@pulsar/emergency-config';
import type { EmergencyCategory } from '@pulsar/shared-types';
import { PulsarTheme } from '../../theme/theme';

const CATEGORIES: Array<{ id: EmergencyCategory; label: string }> = [
  { id: 'MEDICAL', label: 'Medical' },
  { id: 'FIRE', label: 'Fire' },
  { id: 'FLOOD', label: 'Flood' },
  { id: 'EARTHQUAKE', label: 'Earthquake' },
  { id: 'ACCIDENT', label: 'Accident' },
  { id: 'TRAPPED_PERSON', label: 'Trapped' },
  { id: 'VIOLENCE', label: 'Danger' },
  { id: 'OTHER', label: 'Other' },
];

export const EmergencyScreen: React.FC<{ countryCode?: string }> = ({ countryCode = 'IN' }) => {
  const [selectedCategory, setSelectedCategory] = useState<EmergencyCategory>('MEDICAL');
  const [isTestMode, setIsTestMode] = useState<boolean>(true);
  const [deliveryStatus, setDeliveryStatus] = useState<string>('IDLE');
  const numbers = getEmergencyNumbers(countryCode);
  const national = numbers[0];

  const handleHoldSOS = () => {
    const incidentId = `INC-${Date.now().toString(36).toUpperCase()}`;
    setDeliveryStatus(
      isTestMode
        ? `[TEST] ${incidentId} queued for Mesh + Server (Test Mode — no real emergency services contacted)`
        : `${incidentId} queued for Mesh & Trusted Contacts`
    );
  };

  const handleCallNational = () => {
    if (!national) return;
    Alert.alert(
      `Call ${national.displayName} (${national.number})?`,
      `Official Source: ${national.officialSource}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: `Dial ${national.number}`, onPress: () => Linking.openURL(`tel:${national.number}`) },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.testBanner}>
        <Text style={styles.testBannerText}>
          {isTestMode ? 'TEST MODE ACTIVE — No real emergency services will be contacted' : 'LIVE MODE'}
        </Text>
        <TouchableOpacity onPress={() => setIsTestMode(!isTestMode)}>
          <Text style={styles.switchText}>{isTestMode ? 'Switch' : 'Enable Test'}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.header}>DisasterMesh Dispatch</Text>

      <View style={styles.categoryGrid}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.catChip, selectedCategory === cat.id && styles.catChipActive]}
            onPress={() => setSelectedCategory(cat.id)}
          >
            <Text style={styles.catText}>{cat.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.sosButton}
        onLongPress={handleHoldSOS}
        delayLongPress={800}
        activeOpacity={0.85}
      >
        <Text style={styles.sosTitle}>HOLD FOR SOS</Text>
        <Text style={styles.sosSub}>Hold 1s to prevent accidental trigger</Text>
      </TouchableOpacity>

      <View style={styles.statusPanel}>
        <Text style={styles.statusLabel}>Delivery Status</Text>
        <Text style={styles.statusValue}>{deliveryStatus}</Text>
      </View>

      {national && (
        <TouchableOpacity style={styles.callButton} onPress={handleCallNational}>
          <Text style={styles.callButtonText}>
            Call Official Helpline ({national.number} — {national.displayName})
          </Text>
        </TouchableOpacity>
      )}
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
  testBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: PulsarTheme.colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: PulsarTheme.colors.statusWarning,
    borderRadius: PulsarTheme.radii.sm,
    padding: 10,
  },
  testBannerText: {
    color: PulsarTheme.colors.statusWarning,
    fontSize: PulsarTheme.typography.sizes.xs,
    fontWeight: PulsarTheme.typography.weights.semibold,
    flex: 1,
  },
  switchText: {
    color: PulsarTheme.colors.accentCyan,
    fontSize: PulsarTheme.typography.sizes.xs,
    fontWeight: PulsarTheme.typography.weights.bold,
    marginLeft: 8,
  },
  header: {
    fontSize: PulsarTheme.typography.sizes.xxl,
    fontWeight: PulsarTheme.typography.weights.bold,
    color: PulsarTheme.colors.textPrimary,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  catChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: PulsarTheme.radii.sm,
    backgroundColor: PulsarTheme.colors.surfacePrimary,
    borderWidth: 1,
    borderColor: PulsarTheme.colors.surfaceBorder,
  },
  catChipActive: {
    borderColor: PulsarTheme.colors.emergencyCrimson,
    backgroundColor: PulsarTheme.colors.surfaceElevated,
  },
  catText: {
    color: PulsarTheme.colors.textPrimary,
    fontSize: PulsarTheme.typography.sizes.xs,
    fontWeight: PulsarTheme.typography.weights.semibold,
  },
  sosButton: {
    height: 180,
    borderRadius: PulsarTheme.radii.lg,
    backgroundColor: PulsarTheme.colors.emergencyCrimson,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF6B81',
    marginVertical: 8,
  },
  sosTitle: {
    color: PulsarTheme.colors.textPrimary,
    fontSize: PulsarTheme.typography.sizes.hero,
    fontWeight: PulsarTheme.typography.weights.heavy,
    letterSpacing: 1.5,
  },
  sosSub: {
    color: '#FFE4E6',
    fontSize: PulsarTheme.typography.sizes.xs,
    marginTop: 6,
  },
  statusPanel: {
    backgroundColor: PulsarTheme.colors.surfacePrimary,
    borderWidth: 1,
    borderColor: PulsarTheme.colors.surfaceBorder,
    borderRadius: PulsarTheme.radii.md,
    padding: PulsarTheme.spacing.md,
  },
  statusLabel: {
    color: PulsarTheme.colors.textSecondary,
    fontSize: PulsarTheme.typography.sizes.xs,
  },
  statusValue: {
    color: PulsarTheme.colors.textPrimary,
    fontSize: PulsarTheme.typography.sizes.sm,
    fontWeight: PulsarTheme.typography.weights.medium,
    marginTop: 4,
  },
  callButton: {
    backgroundColor: PulsarTheme.colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: PulsarTheme.colors.statusSuccess,
    borderRadius: PulsarTheme.radii.md,
    padding: 14,
    alignItems: 'center',
  },
  callButtonText: {
    color: PulsarTheme.colors.statusSuccess,
    fontWeight: PulsarTheme.typography.weights.bold,
    fontSize: PulsarTheme.typography.sizes.sm,
  },
});
