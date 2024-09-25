import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { AuthContext } from '../src/AuthContext';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';

WebBrowser.maybeCompleteAuthSession();

const Login = ({ navigation }) => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [googleRequest, googleResponse, promptGoogleAsync] = Google.useAuthRequest({
    clientId: '630487360538-a4vtmkbe2cb778956ou0mqqpgpmc3rjo.apps.googleusercontent.com',
    redirectUri: 'https://auth.expo.io/@nguyenvupl93/manageruser',
  });

  const [facebookRequest, facebookResponse, promptFacebookAsync] = Facebook.useAuthRequest({
    appId: '2396426200561589',
    redirectUri: 'https://auth.expo.io/@nguyenvupl93/manageruser',
  });

  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch (error) {
      let errorMessage;
      switch (error.code) {
        case 'auth/wrong-password':
          errorMessage = 'Sai mật khẩu, vui lòng thử lại.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'Không tìm thấy người dùng với email này.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Địa chỉ email không hợp lệ.';
          break;
        default:
          errorMessage = error.message;
      }
      Alert.alert('Đăng nhập thất bại', errorMessage);
    }
  };

  const handleGoogleLogin = async () => {
    const result = await promptGoogleAsync();
    if (result?.type === 'success') {
      console.log('Google login success:', result);
    } else {
      Alert.alert('Đăng nhập với Google thất bại');
    }
  };

  const handleFacebookLogin = async () => {
    const result = await promptFacebookAsync();
    if (result?.type === 'success') {
      const accessToken = result.params.access_token;
      console.log('Facebook login success:', accessToken);
    } else {
      Alert.alert('Đăng nhập với Facebook thất bại');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng Nhập</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>Đăng Nhập</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
        <Image
          source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Google_Logo.png' }}
          style={styles.icon}
        />
        <Text style={styles.googleText}>Đăng nhập với Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.facebookButton} onPress={handleFacebookLogin}>
        <Image
          source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg' }}
          style={styles.icon}
        />
        <Text style={styles.facebookText}>Đăng nhập với Facebook</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.link}>Chưa có tài khoản? Đăng ký</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.link}>Quên mật khẩu?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  input: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  loginButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: '#4285F4',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  facebookButton: {
    flexDirection: 'row',
    backgroundColor: '#1877F2',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  googleText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  facebookText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  icon: {
    width: 24,
    height: 24,
    marginLeft: 10,
  },
  link: {
    textAlign: 'center',
    color: '#007BFF',
    marginTop: 20,
    fontSize: 16,
  },
});

export default Login;
