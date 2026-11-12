import type { Priority } from './packet';

export type EmergencyCategory =
  | 'MEDICAL'
  | 'FIRE'
  | 'FLOOD'
  | 'EARTHQUAKE'
  | 'ACCIDENT'
  | 'MISSING_PERSON'
  | 'TRAPPED_PERSON'
  | 'VIOLENCE'
  | 'FOREST_FIRE'
  | 'WILDLIFE_ENCOUNTER'
  | 'LOST_OFFICER'
  | 'ILLEGAL_ACTIVITY'
  | 'OTHER';

export type IncidentStatus =
  | 'PENDING_LOCAL'
  | 'DISPATCHED_MESH'
  | 'DISPATCHED_SERVER'
  | 'ACKNOWLEDGED'
  | 'RESOLVED'
  | 'CANCELLED';

export interface EmergencyIncident {
  id: string;
  reporterId: string;
  category: EmergencyCategory;
  priority: Priority;
  latitude?: number;
  longitude?: number;
  locationAccuracy?: number;
  description?: string;
  status: IncidentStatus;
  isTestMode: boolean;
  createdAt: string;
}

export interface EmergencyNumberEntry {
  id: string;
  countryCode: string;
  serviceType: 'NATIONAL' | 'POLICE' | 'FIRE' | 'AMBULANCE' | 'DISASTER' | 'WOMEN' | 'CHILD' | 'FOREST';
  displayName: string;
  number: string;
  officialSource: string;
  region: string;
  isEnabled: boolean;
  verifiedDate: string;
}
