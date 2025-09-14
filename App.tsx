import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { PaperProvider } from 'react-native-paper';
import { AuthProvider } from './src/context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <PaperProvider>
      <AppNavigator />
    </PaperProvider>
    </AuthProvider>
  );
}