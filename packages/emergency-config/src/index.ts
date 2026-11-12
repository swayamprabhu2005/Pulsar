import type { EmergencyNumberEntry } from '@pulsar/shared-types';
import { INDIA_EMERGENCY_NUMBERS } from './countries/IN';

export interface CountryConfig {
  countryCode: string;
  countryName: string;
  dialCode: string;
  emergencyNumbers: EmergencyNumberEntry[];
}

export const SUPPORTED_COUNTRIES: Record<string, CountryConfig> = {
  IN: {
    countryCode: 'IN',
    countryName: 'India',
    dialCode: '+91',
    emergencyNumbers: INDIA_EMERGENCY_NUMBERS,
  },
  US: {
    countryCode: 'US',
    countryName: 'United States',
    dialCode: '+1',
    emergencyNumbers: [
      {
        id: 'us-911',
        countryCode: 'US',
        serviceType: 'NATIONAL',
        displayName: 'Emergency Services (Police / Fire / Medical)',
        number: '911',
        officialSource: 'FCC / NENA',
        region: 'National',
        isEnabled: true,
        verifiedDate: '2026-01-01',
      },
    ],
  },
  GB: {
    countryCode: 'GB',
    countryName: 'United Kingdom',
    dialCode: '+44',
    emergencyNumbers: [
      {
        id: 'gb-999',
        countryCode: 'GB',
        serviceType: 'NATIONAL',
        displayName: 'Emergency Services',
        number: '999',
        officialSource: 'UK Government',
        region: 'National',
        isEnabled: true,
        verifiedDate: '2026-01-01',
      },
    ],
  },
};

export function getEmergencyNumbers(countryCode: string): EmergencyNumberEntry[] {
  const config = SUPPORTED_COUNTRIES[countryCode.toUpperCase()];
  if (!config) return [];
  return config.emergencyNumbers.filter((entry) => entry.isEnabled);
}

export function getPrimaryEmergencyNumber(countryCode: string): EmergencyNumberEntry | undefined {
  const numbers = getEmergencyNumbers(countryCode);
  return numbers.find((n) => n.serviceType === 'NATIONAL') ?? numbers[0];
}
