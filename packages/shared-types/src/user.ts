export type AppEdition = 'COMMUNITY' | 'FOREST';

export type UserRole =
  | 'CITIZEN'
  | 'RESPONDER'
  | 'ADMIN'
  | 'FOREST_ADMIN'
  | 'FOREST_OFFICER'
  | 'FIELD_RANGER'
  | 'TOUR_GUIDE'
  | 'VISITOR';

export interface UserProfile {
  id: string;
  phoneMasked: string;
  name: string;
  avatarUrl?: string;
  countryCode: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: string;
}

export interface DeviceInfo {
  id: string;
  userId: string;
  deviceFingerprint: string;
  platform: 'android';
  appVersion: string;
  edition: AppEdition;
  lastSeen: string;
}

export interface ContactSummary {
  id: string;
  displayName: string;
  phoneHash: string;
  isRegistered: boolean;
  registeredUserId?: string;
  isTrusted: boolean;
}
