// src/navigation/types.ts
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NavigatorScreenParams } from '@react-navigation/native'; // Bunu ekle

// Tab Navigator ekranlarını tanımla
export type RootTabParamList = {
  Map: undefined;
  Profile: undefined;
};

// Stack Navigator ekranlarını tanımla
export type RootStackParamList = {
  Login: undefined;
  MainApp: NavigatorScreenParams<RootTabParamList>; // MainApp, Tab Navigator'ı içeriyor
};

// Ekranların kendi prop tipleri
export type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;
// Artık MapScreen ve ProfileScreen, BottomTabScreenProps kullanacak
export type MapScreenProps = BottomTabScreenProps<RootTabParamList, 'Map'>;
export type ProfileScreenProps = BottomTabScreenProps<RootTabParamList, 'Profile'>;