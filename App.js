// App.js
import React, { useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContext, AuthProvider } from './src/AuthContext';
import UserManagement from './screens/UserManagement';
import Profile from './screens/Profile';
import Logout from './screens/Logout';
import Login from './screens/LoginScreen';
import Signup from './screens/SignupScreen';
import ForgotPassword from './screens/ForgotPassword';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
};

const MainNavigator = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      </Stack.Navigator>
    );
  }

  return (
    <Drawer.Navigator initialRouteName="UserManagement">
      <Drawer.Screen name="UserManagement" component={UserManagement} />
      <Drawer.Screen name="Profile" component={Profile} />
      <Drawer.Screen name="Logout" component={Logout} />
    </Drawer.Navigator>
  );
};

export default App;
