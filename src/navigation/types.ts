import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NavigatorScreenParams } from '@react-navigation/native';

export type RootTabParamList = {
  Map: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Login: undefined;
  MainApp: NavigatorScreenParams<RootTabParamList>;
};

export type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;
export type MapScreenProps = BottomTabScreenProps<RootTabParamList, 'Map'>;
export type ProfileScreenProps = BottomTabScreenProps<RootTabParamList, 'Profile'>;