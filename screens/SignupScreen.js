// screens/Signup.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { auth } from '../src/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const Signup = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setError('Mật khẩu không khớp!');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigation.navigate('Login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng ký tài khoản</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Email" 
        onChangeText={setEmail} 
        keyboardType="email-address"
        autoCapitalize="none" 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Mật khẩu" 
        secureTextEntry 
        onChangeText={setPassword} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Xác nhận mật khẩu" 
        secureTextEntry 
        onChangeText={setConfirmPassword} 
      />
      <Button title="Đăng ký" onPress={handleSignup} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Đã có tài khoản? Đăng nhập</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  link: {
    textAlign: 'center',
    color: 'blue',
    marginTop: 15,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default Signup;
