// src/screens/ProfileScreen.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Text, Button, Divider, List } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../constants/colors';

const ProfileScreen = () => {
  // AuthContext'ten logout fonksiyonunu ve kullanıcı durumunu alıyoruz
  const { logout, authState } = useAuth();

  // Şimdilik e-posta adresini temsili olarak gösterelim
  // Gerçek kullanıcı e-postasını authState'ten alabiliriz,
  // bunun için AuthContext'i güncellememiz gerekir.
  // Şimdilik 'user@example.com' olarak bırakalım.
  const userEmail = 'user@example.com'; 

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Profil Başlığı */}
        <View style={styles.profileHeader}>
          <Avatar.Icon size={80} icon="account-circle" style={styles.avatar} />
          <Text style={styles.emailText}>{userEmail}</Text>
          <Text style={styles.memberText}>GezginApp Member</Text>
        </View>
        
        <Divider style={styles.divider} />

        {/* İstatistikler (İleride doldurulacak) */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>15</Text>
            <Text style={styles.statLabel}>Cities Visited</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Countries Visited</Text>
          </View>
        </View>

        <Divider style={styles.divider} />

        {/* Ayarlar Listesi (İsteğe bağlı, genişletilebilir) */}
        <List.Section style={styles.listSection}>
          <List.Item
            title="Account Settings"
            left={() => <List.Icon icon="account-cog" color={COLORS.darkGreen} />}
            onPress={() => console.log('Account Settings pressed')}
          />
          <List.Item
            title="Notifications"
            left={() => <List.Icon icon="bell" color={COLORS.darkGreen} />}
            onPress={() => console.log('Notifications pressed')}
          />
        </List.Section>

        {/* Çıkış Yap Butonu */}
        <Button
          icon="logout"
          mode="contained"
          onPress={logout} // AuthContext'ten gelen logout fonksiyonunu çağır
          style={styles.logoutButton}
          labelStyle={styles.logoutButtonText}
          color={COLORS.primary} 
        >
          Log Out
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    backgroundColor: COLORS.lightGreen,
    marginBottom: 15,
  },
  emailText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  memberText: {
    fontSize: 16,
    color: COLORS.darkGreen,
    marginTop: 4,
  },
  divider: {
    marginVertical: 20,
    backgroundColor: COLORS.lightGreen,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.darkGreen,
    marginTop: 4,
  },
  listSection: {
    marginTop: 10,
  },
  logoutButton: {
    marginTop: 30,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
  },
});

export default ProfileScreen;