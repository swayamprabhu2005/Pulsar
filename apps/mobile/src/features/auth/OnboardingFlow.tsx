import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import { SUPPORTED_COUNTRIES } from '@pulsar/emergency-config';
import { PulsarTheme } from '../../theme/theme';

interface OnboardingFlowProps {
  onComplete: (user: { name: string; phone: string; countryCode: string }) => void;
}

type Step = 'WELCOME' | 'PHONE' | 'OTP' | 'PROFILE' | 'PERMISSIONS';

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [step, setStep] = useState<Step>('WELCOME');
  const [countryCode, setCountryCode] = useState<string>('IN');
  const [phone, setPhone] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [permStatus, setPermStatus] = useState<Record<string, boolean>>({
    bluetooth: false,
    location: false,
    notifications: false,
    contacts: false,
  });

  const country = SUPPORTED_COUNTRIES[countryCode] ?? SUPPORTED_COUNTRIES.IN;

  const requestAndroidPermissions = async () => {
    if (Platform.OS !== 'android') return;
    try {
      const results = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ...(Number(Platform.Version) >= 31
          ? [
              PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
              PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
              PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            ]
          : []),
      ]);

      const locGranted =
        results[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ===
        PermissionsAndroid.RESULTS.GRANTED;

      const bleGranted =
        Number(Platform.Version) >= 31
          ? results[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] ===
            PermissionsAndroid.RESULTS.GRANTED
          : locGranted;

      setPermStatus((prev) => ({
        ...prev,
        bluetooth: bleGranted,
        location: locGranted,
        notifications: true,
      }));
    } catch {
      Alert.alert('Permission notice', 'You can grant permissions later in Android Settings.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {step === 'WELCOME' && (
        <View style={styles.card}>
          <Image source={require('../../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.title}>Pulsar</Text>
          <Text style={styles.tagline}>Connected when it matters. Even when networks fail.</Text>
          <Text style={styles.body}>
            Decentralized emergency alerting, offline mesh messaging, and community safety — powered by local Bluetooth & Wi-Fi Direct.
          </Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => setStep('PHONE')}>
            <Text style={styles.primaryButtonText}>Continue with Phone Number</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 'PHONE' && (
        <View style={styles.card}>
          <Text style={styles.stepTitle}>Phone Verification</Text>
          <Text style={styles.body}>
            Your phone number is required to verify your identity and allow trusted contacts to reach you during emergencies.
          </Text>

          <Text style={styles.label}>Country</Text>
          <View style={styles.countryRow}>
            {Object.values(SUPPORTED_COUNTRIES).map((c) => (
              <TouchableOpacity
                key={c.countryCode}
                style={[styles.chip, countryCode === c.countryCode && styles.chipActive]}
                onPress={() => setCountryCode(c.countryCode)}
              >
                <Text style={styles.chipText}>
                  {c.countryName} ({c.dialCode})
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.phoneInputRow}>
            <Text style={styles.dialCode}>{country.dialCode}</Text>
            <TextInput
              style={styles.input}
              placeholder="9876543210"
              placeholderTextColor={PulsarTheme.colors.textMuted}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          <TouchableOpacity
            style={[styles.primaryButton, phone.trim().length < 7 && styles.buttonDisabled]}
            disabled={phone.trim().length < 7}
            onPress={() => setStep('OTP')}
          >
            <Text style={styles.primaryButtonText}>Send Verification Code</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 'OTP' && (
        <View style={styles.card}>
          <Text style={styles.stepTitle}>Enter OTP Code</Text>
          <Text style={styles.body}>
            Enter the 6-digit verification code sent to {country.dialCode} {phone}.
          </Text>
          <TextInput
            style={styles.otpInput}
            placeholder="000000"
            placeholderTextColor={PulsarTheme.colors.textMuted}
            keyboardType="number-pad"
            maxLength={6}
            value={otp}
            onChangeText={setOtp}
          />
          <TouchableOpacity
            style={[styles.primaryButton, otp.length < 4 && styles.buttonDisabled]}
            disabled={otp.length < 4}
            onPress={() => setStep('PROFILE')}
          >
            <Text style={styles.primaryButtonText}>Verify & Continue</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 'PROFILE' && (
        <View style={styles.card}>
          <Text style={styles.stepTitle}>Your Profile</Text>
          <Text style={styles.body}>
            This name is shown to trusted contacts and emergency responders during an SOS.
          </Text>
          <TextInput
            style={styles.inputFull}
            placeholder="Full Name"
            placeholderTextColor={PulsarTheme.colors.textMuted}
            value={name}
            onChangeText={setName}
          />
          <TouchableOpacity
            style={[styles.primaryButton, !name.trim() && styles.buttonDisabled]}
            disabled={!name.trim()}
            onPress={() => setStep('PERMISSIONS')}
          >
            <Text style={styles.primaryButtonText}>Review Permissions</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 'PERMISSIONS' && (
        <View style={styles.card}>
          <Text style={styles.stepTitle}>Device Capabilities</Text>
          <Text style={styles.body}>
            Pulsar never silently accesses personal data or toggles your radios. Grant only what you choose:
          </Text>

          <View style={styles.permRow}>
            <Text style={styles.permName}>Bluetooth & Nearby Devices</Text>
            <Text style={styles.permDesc}>Discover nearby Pulsar nodes for offline mesh relay.</Text>
          </View>
          <View style={styles.permRow}>
            <Text style={styles.permName}>Location (GPS)</Text>
            <Text style={styles.permDesc}>Attach coordinates to SOS alerts and SafeWalk sessions.</Text>
          </View>
          <View style={styles.permRow}>
            <Text style={styles.permName}>Contacts (Optional)</Text>
            <Text style={styles.permDesc}>Privacy-preserving hash match to find registered friends.</Text>
          </View>

          <TouchableOpacity style={styles.secondaryButton} onPress={requestAndroidPermissions}>
            <Text style={styles.secondaryButtonText}>
              {permStatus.bluetooth ? 'Permissions Granted ✓' : 'Grant Mesh & Location Permissions'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() =>
              onComplete({
                name: name.trim(),
                phone: `${country.dialCode}${phone.trim()}`,
                countryCode,
              })
            }
          >
            <Text style={styles.primaryButtonText}>Enter Pulsar</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: PulsarTheme.colors.canvas,
    justifyContent: 'center',
    padding: PulsarTheme.spacing.lg,
  },
  card: {
    backgroundColor: PulsarTheme.colors.surfacePrimary,
    borderRadius: PulsarTheme.radii.lg,
    borderWidth: 1,
    borderColor: PulsarTheme.colors.surfaceBorder,
    padding: PulsarTheme.spacing.lg,
    gap: PulsarTheme.spacing.md,
  },
  logo: {
    width: 96,
    height: 108,
    alignSelf: 'center',
  },
  title: {
    fontSize: PulsarTheme.typography.sizes.hero,
    fontWeight: PulsarTheme.typography.weights.heavy,
    color: PulsarTheme.colors.textPrimary,
    textAlign: 'center',
  },
  tagline: {
    fontSize: PulsarTheme.typography.sizes.sm,
    fontWeight: PulsarTheme.typography.weights.semibold,
    color: PulsarTheme.colors.accentCyan,
    textAlign: 'center',
  },
  stepTitle: {
    fontSize: PulsarTheme.typography.sizes.xxl,
    fontWeight: PulsarTheme.typography.weights.bold,
    color: PulsarTheme.colors.textPrimary,
  },
  body: {
    fontSize: PulsarTheme.typography.sizes.sm,
    color: PulsarTheme.colors.textSecondary,
    lineHeight: 20,
  },
  label: {
    fontSize: PulsarTheme.typography.sizes.xs,
    fontWeight: PulsarTheme.typography.weights.semibold,
    color: PulsarTheme.colors.textSecondary,
  },
  countryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: PulsarTheme.spacing.sm,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: PulsarTheme.radii.sm,
    borderWidth: 1,
    borderColor: PulsarTheme.colors.surfaceBorder,
    backgroundColor: PulsarTheme.colors.surfaceSecondary,
  },
  chipActive: {
    borderColor: PulsarTheme.colors.accentPrimary,
    backgroundColor: PulsarTheme.colors.surfaceElevated,
  },
  chipText: {
    color: PulsarTheme.colors.textPrimary,
    fontSize: PulsarTheme.typography.sizes.xs,
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PulsarTheme.colors.surfaceSecondary,
    borderRadius: PulsarTheme.radii.md,
    borderWidth: 1,
    borderColor: PulsarTheme.colors.surfaceBorder,
    paddingHorizontal: PulsarTheme.spacing.md,
  },
  dialCode: {
    color: PulsarTheme.colors.textPrimary,
    fontWeight: PulsarTheme.typography.weights.bold,
    marginRight: PulsarTheme.spacing.sm,
  },
  input: {
    flex: 1,
    color: PulsarTheme.colors.textPrimary,
    paddingVertical: 14,
    fontSize: PulsarTheme.typography.sizes.base,
  },
  inputFull: {
    backgroundColor: PulsarTheme.colors.surfaceSecondary,
    borderRadius: PulsarTheme.radii.md,
    borderWidth: 1,
    borderColor: PulsarTheme.colors.surfaceBorder,
    padding: 14,
    color: PulsarTheme.colors.textPrimary,
    fontSize: PulsarTheme.typography.sizes.base,
  },
  otpInput: {
    backgroundColor: PulsarTheme.colors.surfaceSecondary,
    borderRadius: PulsarTheme.radii.md,
    borderWidth: 1,
    borderColor: PulsarTheme.colors.surfaceBorder,
    padding: 16,
    color: PulsarTheme.colors.textPrimary,
    fontSize: PulsarTheme.typography.sizes.xxl,
    textAlign: 'center',
    letterSpacing: 8,
  },
  permRow: {
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: PulsarTheme.colors.surfaceBorder,
  },
  permName: {
    color: PulsarTheme.colors.textPrimary,
    fontWeight: PulsarTheme.typography.weights.semibold,
    fontSize: PulsarTheme.typography.sizes.sm,
  },
  permDesc: {
    color: PulsarTheme.colors.textSecondary,
    fontSize: PulsarTheme.typography.sizes.xs,
    marginTop: 2,
  },
  primaryButton: {
    backgroundColor: PulsarTheme.colors.accentPrimary,
    paddingVertical: 14,
    borderRadius: PulsarTheme.radii.md,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: PulsarTheme.colors.textPrimary,
    fontWeight: PulsarTheme.typography.weights.bold,
    fontSize: PulsarTheme.typography.sizes.base,
  },
  secondaryButton: {
    backgroundColor: PulsarTheme.colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: PulsarTheme.colors.accentPrimary,
    paddingVertical: 12,
    borderRadius: PulsarTheme.radii.md,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: PulsarTheme.colors.accentCyan,
    fontWeight: PulsarTheme.typography.weights.semibold,
    fontSize: PulsarTheme.typography.sizes.sm,
  },
  buttonDisabled: {
    opacity: 0.45,
  },
});
