import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { ForestOnboarding } from './features/forestmesh/ForestOnboarding';
import { ForestNavigator } from './navigation/ForestNavigator';
import type { UserRole } from '@pulsar/shared-types';

export default function App() {
  const [profile, setProfile] = useState<{
    name: string;
    phone: string;
    role: UserRole;
    zoneId: string;
  } | null>(null);

  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#060E0A" />
      {profile ? (
        <ForestNavigator
          userName={profile.name}
          role={profile.role}
          zone={profile.zoneId}
        />
      ) : (
        <ForestOnboarding onComplete={(p) => setProfile(p)} />
      )}
    </NavigationContainer>
  );
}
