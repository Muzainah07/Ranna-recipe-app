import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeStack from './HomeStack';
import CategoriesStack from './CategoriesStack';
import SavedStack from './SavedStack';
import { useTheme } from '../utils/ThemeContext';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  const { theme } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: theme.tabBar, borderTopColor: theme.border },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.subtext,
        tabBarIcon: ({ focused, color, size }) => {
          const icons = {
            HomeTab: focused ? 'home' : 'home-outline',
            CategoriesTab: focused ? 'grid' : 'grid-outline',
            SavedTab: focused ? 'heart' : 'heart-outline',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStack} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="CategoriesTab" component={CategoriesStack} options={{ tabBarLabel: 'Categories' }} />
      <Tab.Screen name="SavedTab" component={SavedStack} options={{ tabBarLabel: 'Saved' }} />
    </Tab.Navigator>
  );
}
