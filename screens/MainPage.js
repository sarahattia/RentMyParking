import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import SearchScreen from './SearchScreen';
import PersonalAccount from './PersonalAccount';

const Tab = createBottomTabNavigator();

export default function MainPage({ route }) {
  const { userID } = route.params;
  console.log("UserID reçu dans main:", userID);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Search') {
            iconName = 'search-outline';
          } else if (route.name === 'Personal') {
            iconName = 'person-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FFA500',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { display: 'flex' },
        headerShown: false 
      })}
    >
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        initialParams={{ userID: userID }} 
      />
      <Tab.Screen
        name="Personal"
        component={PersonalAccount}
        initialParams={{ userID: userID }} 
      />
    </Tab.Navigator>
  );
}
