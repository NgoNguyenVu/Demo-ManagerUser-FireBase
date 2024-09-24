// MainNavigator.js
import React, { useContext } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext } from '../src/AuthContext'; // Adjust the path as necessary

// Import your screens
import UserManagement from '../screens/UserManagement'; // Main screen after login
import LoginScreen from '../screens/LoginScreen'; // Login screen
import ProfileScreen from '../screens/Profile'; // Profile screen
import LogoutScreen from '../screens/Logout'; // Logout screen (optional)

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      {/* Add other screens for non-authenticated users if needed */}
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={UserManagement} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Logout" component={LogoutScreen} />
    </Drawer.Navigator>
  );
};

const MainNavigator = () => {
  const { user } = useContext(AuthContext);

  return (
    <NavigationContainer>
      {user ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default MainNavigator;
