import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // Burası değişti!
import { TextInput, Button } from 'react-native-paper';
import { COLORS } from '../constants/colors';
import { useAuth } from '../context/AuthContext';
import KeyboardDismissableView from '../components/KeyboardDismissableView';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch (error) {
      Alert.alert("Login Failed", "Please check your email and password.");
    }
  };

  return (
    <KeyboardDismissableView>
      <SafeAreaView style={styles.container}>
      {/* Logo Alanı */}
      <View style={styles.logoContainer}>
        <Image 
          source={{ uri: 'https://img.icons8.com/material-outlined/96/344E41/leaf.png' }} 
          style={styles.logo}
        />
        <Text style={styles.appName}>GezginApp</Text>
      </View>
      
      {/* Başlıklar */}
      <Text style={styles.title}>Welcome Back!</Text>
      <Text style={styles.subtitle}>Log in to continue your journey</Text>
      
      {/* Form Alanı */}
      <View style={styles.formContainer}>
        <TextInput
          label="Email"
          mode="outlined"
          style={styles.input}
          outlineColor={COLORS.lightGreen}
          activeOutlineColor={COLORS.primary}
          onChangeText={setEmail}
          inputMode='email'
        />
        <TextInput
          label="Password"
          mode="outlined"
          secureTextEntry
          style={styles.input}
          outlineColor={COLORS.lightGreen}
          activeOutlineColor={COLORS.primary}
          right={<TextInput.Icon icon="eye" />}
          onChangeText={setPassword}
        />
        <Button
          mode="contained"
          onPress={handleLogin}
          style={styles.button}
          labelStyle={styles.buttonText}
          color={COLORS.primary}
        >
          Log In
        </Button>
      </View>
      
      {/* Alt Linkler */}
      <Text style={styles.forgotPassword}>Forgot Password?</Text>
      
      <View style={{marginTop: 40}}>
        <Text style={styles.signupText}>
          Don't have an account?{' '}
          <Text style={styles.signupLink}>Sign Up</Text>
        </Text>
      </View>

    </SafeAreaView>
    </KeyboardDismissableView>
  );
};

// Stiller aynı kalıyor.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    paddingTop: 50,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.darkGreen,
    marginBottom: 30,
  },
  formContainer: {
    width: '85%',
  },
  input: {
    marginBottom: 15,
    backgroundColor: COLORS.white,
  },
  button: {
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  forgotPassword: {
    marginTop: 15,
    color: COLORS.darkGreen,
    fontWeight: '500',
  },
  signupText: {
    color: COLORS.darkGreen,
  },
  signupLink: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});

export default LoginScreen;