import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity } from 'react-native';

// Import các màn hình
import HomeScreen from './screens/HomeScreen';
import ServiceDetailsScreen from './screens/ServiceDetailsScreen';
import BookServiceScreen from './screens/BookServiceScreen';
import ServiceListScreen from './screens/ServiceListScreen';
import ServiceManagementScreen from './screens/ServiceManagementScreen';
import UserManagementScreen from './screens/UserManagement';
import ProfileScreen from './screens/Profile';
import LogoutScreen from './screens/Logout';
import Login from './screens/LoginScreen'; 
import Signup from './screens/SignupScreen'; // Import Signup screen
import ForgotPassword from './screens/ForgotPassword'; // Import ForgotPassword// Import Login screen
import AppointmentManagementScreen from './screens/AppointmentManagementScreen';
import { AuthContext, AuthProvider } from './src/AuthContext'; // Import Auth context
import PaymentScreen from './screens/PaymentScreen'; // Import Payment screen

// Tạo Tab và Stack Navigators
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Custom Header
const CustomHeader = ({ navigation, title = 'Spa King' }) => (
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, paddingTop: 32 }}>
    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{title}</Text>
    <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
      <Ionicons name="person-circle" size={30} color="black" />
    </TouchableOpacity>
  </View>
);

// HomeStack bao gồm các màn hình Home và Profile
const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="HomeMain" 
      component={HomeScreen} 
      options={({ navigation }) => ({
        header: () => <CustomHeader navigation={navigation} title="Spa King" />
      })} 
    />
    <Stack.Screen 
      name="ServiceDetailsScreen" 
      component={ServiceDetailsScreen} 
      options={{ headerShown: true, headerTitle: '' }} 
    />
    <Stack.Screen 
      name="ServiceListScreen" 
      component={ServiceListScreen} 
      options={{ headerShown: true, headerTitle: '' }} 
    />
    <Stack.Screen 
      name="BookServiceScreen" 
      component={BookServiceScreen} 
      options={{ headerShown: true, headerTitle: '' }} 
    />
    <Stack.Screen 
      name="PaymentScreen" 
      component={PaymentScreen} 
      options={{ headerShown: true, title: 'Payment' }} 
    />
    {/* Thêm ProfileScreen vào trong HomeStack */}
    <Stack.Screen 
      name="ProfileScreen" 
      component={ProfileScreen} 
      options={{ headerShown: true, title: 'Profile' }} 
    />
  </Stack.Navigator>
);

// Stack navigator chính bao gồm cả MainTabNavigator và Login
const AppStack = () => (
  <Stack.Navigator>
    {/* Tab chính */}
    <Stack.Screen 
      name="MainTab" 
      component={MainTabNavigator} 
      options={{ headerShown: false }} 
    />
    {/* Đảm bảo Login screen nằm trong navigator chính */}
    <Stack.Screen 
      name="Login" 
      component={Login} 
      options={{ headerShown: false }} 
    />
    <Stack.Screen 
      name="Signup" 
      component={Signup} 
      options={{ title: 'Đăng Ký' }} 
    />
    <Stack.Screen 
      name="ForgotPassword" 
      component={ForgotPassword} 
      options={{ title: 'Quên Mật Khẩu' }} 
    />
  </Stack.Navigator>
);

// Tab Navigator chính
const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;
        if (route.name === 'HomeTab') {
          iconName = 'home';
        } else if (route.name === 'ServicesTab') {
          iconName = 'briefcase';
        } else if (route.name === 'UsersTab') {
          iconName = 'people';
        } else if (route.name === 'AppointmentsTab') {
          iconName = 'calendar';
        } else if (route.name === 'SettingTab') {
          iconName = 'settings';
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      headerShown: false, // Ẩn header mặc định của Tab.Navigator
    })}
  >
    <Tab.Screen name="HomeTab" component={HomeStack} options={{ title: 'Home' }} />
    <Tab.Screen name="ServicesTab" component={ServiceManagementScreen} options={{ title: 'Services' }} />
    <Tab.Screen name="UsersTab" component={UserManagementScreen} options={{ title: 'Users' }} />
    <Tab.Screen name="AppointmentsTab" component={AppointmentManagementScreen} options={{ title: 'Appointments' }} />
    <Tab.Screen name="SettingTab" component={LogoutScreen} options={{ title: 'Setting' }} />
  </Tab.Navigator>
);

// Hàm chính cho ứng dụng
export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer> 
        <AuthConsumer />
      </NavigationContainer>
    </AuthProvider>
  );
}

// Component để xử lý điều hướng dựa trên trạng thái đăng nhập
const AuthConsumer = () => {
  const { user } = useContext(AuthContext);
  return user ? <AppStack /> : <Login />; 
};
