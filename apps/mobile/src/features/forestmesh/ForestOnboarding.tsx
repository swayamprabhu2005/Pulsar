import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import type { UserRole } from '@pulsar/shared-types';
import { PulsarTheme } from '../../theme/theme';

interface ForestOnboardingProps {
  onComplete: (user: { name: string; phone: string; role: UserRole; zoneId: string }) => void;
}

const ROLES: Array<{ role: UserRole; title: string; desc: string }> = [
  { role: 'FOREST_OFFICER', title: 'Forest Officer', desc: 'Zone oversight, patrol dispatch & incident response' },
  { role: 'FIELD_RANGER', title: 'Field Ranger', desc: 'Active patrols, relay health check & field SOS' },
  { role: 'TOUR_GUIDE', title: 'Tour Guide', desc: 'Lead tourist expeditions & manage temporary trip groups' },
  { role: 'VISITOR', title: 'Visitor / Tourist', desc: 'Offline trail safety, group check-ins & emergency beacon' },
];

export const ForestOnboarding: React.FC<ForestOnboardingProps> = ({ onComplete }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('FIELD_RANGER');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [zone, setZone] = useState('Nagarhole Zone A');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Image source={require('../../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>Pulsar Field</Text>
        <Text style={styles.subtitle}>Remote Operations & Wilderness Mesh System</Text>

        <Text style={styles.sectionHeading}>Select Your Field Role</Text>
        <View style={styles.rolesList}>
          {ROLES.map((r) => (
            <TouchableOpacity
              key={r.role}
              style={[styles.roleCard, selectedRole === r.role && styles.roleCardActive]}
              onPress={() => setSelectedRole(r.role)}
            >
              <Text style={styles.roleTitle}>{r.title}</Text>
              <Text style={styles.roleDesc}>{r.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Officer / Guide Name"
          placeholderTextColor={PulsarTheme.colors.textMuted}
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="+91 9876543210"
          placeholderTextColor={PulsarTheme.colors.textMuted}
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <Text style={styles.label}>Assigned Forest Zone</Text>
        <TextInput
          style={styles.input}
          value={zone}
          onChangeText={setZone}
          placeholder="e.g. Bandipur North / Zone 3"
          placeholderTextColor={PulsarTheme.colors.textMuted}
        />

        <TouchableOpacity
          style={[styles.submitButton, (!name.trim() || !phone.trim()) && styles.disabled]}
          disabled={!name.trim() || !phone.trim()}
          onPress={() => onComplete({ name: name.trim(), phone: phone.trim(), role: selectedRole, zoneId: zone })}
        >
          <Text style={styles.submitButtonText}>Initialize Field Station</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#060E0A', // Dark forest canvas
    padding: PulsarTheme.spacing.lg,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#0D1A14',
    borderRadius: PulsarTheme.radii.lg,
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.15)',
    padding: PulsarTheme.spacing.lg,
    gap: PulsarTheme.spacing.md,
  },
  logo: {
    width: 80,
    height: 90,
    alignSelf: 'center',
  },
  title: {
    fontSize: PulsarTheme.typography.sizes.hero,
    fontWeight: PulsarTheme.typography.weights.heavy,
    color: '#34D399', // Emerald Green
    textAlign: 'center',
  },
  subtitle: {
    fontSize: PulsarTheme.typography.sizes.xs,
    color: '#A7F3D0',
    textAlign: 'center',
    marginBottom: 8,
  },
  sectionHeading: {
    fontSize: PulsarTheme.typography.sizes.sm,
    fontWeight: PulsarTheme.typography.weights.bold,
    color: PulsarTheme.colors.textPrimary,
  },
  rolesList: {
    gap: 8,
  },
  roleCard: {
    padding: 12,
    borderRadius: PulsarTheme.radii.md,
    backgroundColor: '#13231B',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  roleCardActive: {
    borderColor: '#10B981',
    backgroundColor: '#183327',
  },
  roleTitle: {
    color: PulsarTheme.colors.textPrimary,
    fontWeight: PulsarTheme.typography.weights.bold,
    fontSize: PulsarTheme.typography.sizes.sm,
  },
  roleDesc: {
    color: '#94A3B8',
    fontSize: PulsarTheme.typography.sizes.xs,
    marginTop: 2,
  },
  label: {
    color: '#94A3B8',
    fontSize: PulsarTheme.typography.sizes.xs,
    fontWeight: PulsarTheme.typography.weights.semibold,
  },
  input: {
    backgroundColor: '#13231B',
    borderRadius: PulsarTheme.radii.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 12,
    color: PulsarTheme.colors.textPrimary,
    fontSize: PulsarTheme.typography.sizes.sm,
  },
  submitButton: {
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: PulsarTheme.radii.md,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#060E0A',
    fontWeight: PulsarTheme.typography.weights.heavy,
    fontSize: PulsarTheme.typography.sizes.base,
  },
  disabled: {
    opacity: 0.5,
  },
});
