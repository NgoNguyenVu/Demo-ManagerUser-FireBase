import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from './firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { Alert } from 'react-native';

export const AuthContext = createContext();

const INACTIVITY_TIMEOUT = 15000; // 1 hour in milliseconds

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [logoutTimer, setLogoutTimer] = useState(null);

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const loggedInUser = userCredential.user;
    setUser(loggedInUser);
    await AsyncStorage.setItem('user', JSON.stringify(loggedInUser)); // Save user info
    resetLogoutTimer(); // Reset timer on login
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    await AsyncStorage.removeItem('user'); // Remove user info on logout
    clearTimeout(logoutTimer); // Clear the timer
    Alert.alert("Session Expired", "Your session has expired due to inactivity. Please log in again.");
  };

  const resetLogoutTimer = () => {
    clearTimeout(logoutTimer);
    const timer = setTimeout(() => {
      logout(); // Automatically logout after inactivity
    }, INACTIVITY_TIMEOUT);
    setLogoutTimer(timer);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        await AsyncStorage.setItem('user', JSON.stringify(user));
        resetLogoutTimer(); // Reset timer on state change
      } else {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser)); // Restore user state from AsyncStorage
          resetLogoutTimer(); // Reset timer for restored user
        }
      }
    });

    return () => {
      unsubscribe();
      clearTimeout(logoutTimer); // Clear timer on unmount
    };
  }, []);

  // Reset timer on user activity
  useEffect(() => {
    const handleUserActivity = () => {
      resetLogoutTimer();
    };

    // Using a touchable area or a component that wraps your app
    const touchableArea = {
      onStartShouldSetResponder: () => true,
      onResponderStart: handleUserActivity,
    };

    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
