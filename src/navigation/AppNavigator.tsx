import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList, RootTabParamList } from './types'; // types dosyasını güncelleyeceğiz
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, ActivityIndicator } from 'react-native'
import { COLORS } from '../constants/colors';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import MapScreen from '../screens/MapScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

// Kullanıcı giriş yaptıktan sonra göreceği alt sekmeli yapı
function MainAppTabs() {
    const { authState } = useAuth();

    if (authState.authenticated === null) {
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" />
          </View>
        );
      }
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, // Her sekmenin kendi başlığı olmasın
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.darkGreen,
        tabBarStyle: {
          backgroundColor: COLORS.lightGreen,
          borderTopWidth: 0, // Üstteki çizgiyi kaldır
        },
      }}
    >
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarLabel: 'Map',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="map-marker" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Uygulamanın ana navigasyon akışı
const AppNavigator = () => {
    const { authState } = useAuth(); // authState'i context'ten al
  
    // Henüz token kontrolü bitmediyse bir yükleme ekranı göster
    if (authState.authenticated === null) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      );
    }
  
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {authState.authenticated ? (
            <Stack.Screen name="MainApp" component={MainAppTabs} />
          ) : (
            <Stack.Screen name="Login" component={LoginScreen} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    );
  };

export default AppNavigator;