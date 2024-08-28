import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import SignUpPage from './screens/SignUpPage';
import SignInPage from './screens/SignInPage';
import MainPage from './screens/MainPage';
import PersonalAccount from './screens/PersonalAccount';
import MapScreen from './screens/MapScreen';
import SearchScreen from './screens/SearchScreen';
import PaymentScreen from './screens/PaymentScreen';

const Stack = createNativeStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator initialRouteName="Home">
    <Stack.Screen name="Home" component={HomeScreen} options={{ headerTitle: '' }} />
    <Stack.Screen name="SignUp" component={SignUpPage} options={{ headerTitle: '' }} />
    <Stack.Screen name="SignIn" component={SignInPage} options={{ headerTitle: '' }} />
    <Stack.Screen name="Main" component={MainPage} options={{ headerTitle: '' }} />
    <Stack.Screen name="Personal" component={PersonalAccount} options={{ headerTitle: '' }} />
    <Stack.Screen name="Map" component={MapScreen} options={{ headerTitle: '' }} />
    <Stack.Screen name="Search" component={SearchScreen} options={{ headerTitle: '' }} />
    <Stack.Screen name="Payment" component={PaymentScreen} options={{ headerTitle: '' }} />
  </Stack.Navigator>
  
  
  );
}

export default function Navigation() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}
