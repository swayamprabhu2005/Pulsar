import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../features/home/HomeScreen';
import { MessagesScreen } from '../features/messaging/MessagesScreen';
import { CrowdCastScreen } from '../features/crowdcast/CrowdCastScreen';
import { SafeWalkScreen } from '../features/safewalk/SafeWalkScreen';
import { EmergencyScreen } from '../features/disastermesh/EmergencyScreen';
import { PulsarTheme } from '../theme/theme';

const Tab = createBottomTabNavigator();

export const CommunityNavigator: React.FC<{ userName: string; countryCode: string }> = ({
  userName,
  countryCode,
}) => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: PulsarTheme.colors.surfacePrimary },
        headerTintColor: PulsarTheme.colors.textPrimary,
        tabBarStyle: {
          backgroundColor: PulsarTheme.colors.surfacePrimary,
          borderTopColor: PulsarTheme.colors.surfaceBorder,
        },
        tabBarActiveTintColor: PulsarTheme.colors.accentCyan,
        tabBarInactiveTintColor: PulsarTheme.colors.textMuted,
      }}
    >
      <Tab.Screen name="Home">{() => <HomeScreen userName={userName} />}</Tab.Screen>
      <Tab.Screen name="Messages" component={MessagesScreen} />
      <Tab.Screen name="CrowdCast" component={CrowdCastScreen} />
      <Tab.Screen name="SafeWalk" component={SafeWalkScreen} />
      <Tab.Screen
        name="Emergency"
        options={{ tabBarActiveTintColor: PulsarTheme.colors.emergencyCrimson }}
      >
        {() => <EmergencyScreen countryCode={countryCode} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};
