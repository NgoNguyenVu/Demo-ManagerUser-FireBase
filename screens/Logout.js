// screens/Logout.js
import React, { useContext } from 'react';
import { View, Button } from 'react-native';
import { AuthContext } from '../src/AuthContext';

const Logout = ({ navigation }) => {
  const { logout } = useContext(AuthContext);

  return (
    <View>
      <Button title="Log Out" onPress={async () => {
        await logout();
        navigation.navigate('Login'); // Navigate to Login screen
      }} />
    </View>
  );
};

export default Logout;
