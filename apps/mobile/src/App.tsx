import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { OnboardingFlow } from './features/auth/OnboardingFlow';
import { CommunityNavigator } from './navigation/CommunityNavigator';
import { PulsarTheme } from './theme/theme';

export default function App() {
  const [user, setUser] = useState<{ name: string; phone: string; countryCode: string } | null>(
    null
  );

  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor={PulsarTheme.colors.canvas} />
      {user ? (
        <CommunityNavigator userName={user.name} countryCode={user.countryCode} />
      ) : (
        <OnboardingFlow onComplete={(u) => setUser(u)} />
      )}
    </NavigationContainer>
  );
}
