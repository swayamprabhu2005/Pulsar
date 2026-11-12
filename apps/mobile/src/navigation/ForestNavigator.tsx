import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ForestHomeScreen } from '../features/forestmesh/ForestHomeScreen';
import { MessagesScreen } from '../features/messaging/MessagesScreen';
import { EmergencyScreen } from '../features/disastermesh/EmergencyScreen';
import { PulsarTheme } from '../theme/theme';

const Tab = createBottomTabNavigator();

export const ForestNavigator: React.FC<{
  userName: string;
  role: string;
  zone: string;
}> = ({ userName, role, zone }) => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#0D1A14' },
        headerTintColor: '#34D399',
        tabBarStyle: {
          backgroundColor: '#0D1A14',
          borderTopColor: 'rgba(52, 211, 153, 0.15)',
        },
        tabBarActiveTintColor: '#34D399',
        tabBarInactiveTintColor: '#64748B',
      }}
    >
      <Tab.Screen name="Field Home">
        {() => <ForestHomeScreen userName={userName} role={role} zone={zone} />}
      </Tab.Screen>
      <Tab.Screen name="Ranger Chat" component={MessagesScreen} />
      <Tab.Screen
        name="Field SOS"
        options={{ tabBarActiveTintColor: '#DC2626' }}
      >
        {() => <EmergencyScreen countryCode="IN" />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};
