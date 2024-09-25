import React, { createContext, useState, useEffect } from 'react';
import { View, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from './firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const loggedInUser = userCredential.user;
      setUser(loggedInUser);
      await AsyncStorage.setItem('user', JSON.stringify(loggedInUser)); // Save user info
    } catch (error) {
      Alert.alert('Login Error', error.message);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    await AsyncStorage.removeItem('user'); // Remove user info on logout
    Alert.alert("Logged Out", "You have been logged out successfully.");
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        await AsyncStorage.setItem('user', JSON.stringify(user));
      } else {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser)); // Restore user state from AsyncStorage
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <AuthContext.Provider value={{ user, login, logout }}>
        {children}
      </AuthContext.Provider>
    </View>
  );
};
