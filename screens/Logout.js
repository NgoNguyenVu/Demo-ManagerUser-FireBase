// screens/Logout.js
import React, { useContext } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { AuthContext } from '../src/AuthContext';

const Logout = ({ navigation }) => {
  const { logout } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Button 
        title="Log Out" 
        onPress={async () => {
          await logout();  // Đăng xuất người dùng
          navigation.navigate('Login'); // Điều hướng đến màn hình Login
        }} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Logout;
