// src/screens/ProfileScreen.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity  } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Text, Button, Divider, List } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../constants/colors';

const THEME_OPTIONS = [
  COLORS.primary,   // #588157 (Yeşil)
  '#4a4e69',        // Morumsu Gri
  '#d62828',        // Canlı Kırmızı
  '#f77f00',        // Turuncu
];

const ProfileScreen = () => {
    const { logout, authState, setThemeColor } = useAuth();
  const { themeColor } = authState;

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

        {/* --- YENİ BÖLÜM: TEMA RENGİ SEÇİMİ --- */}
        <View>
          <Text style={styles.sectionTitle}>Map Color</Text>
          <View style={styles.colorSelectorContainer}>
            {THEME_OPTIONS.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  // Seçili olan rengin etrafına bir çerçeve ekle
                  themeColor === color && styles.colorOptionSelected,
                ]}
                onPress={() => setThemeColor(color)}
              />
            ))}
          </View>
        </View>

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
    marginVertical: 15, // Dikey boşluğu biraz azaltalım
    backgroundColor: COLORS.lightGreen,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 15,
  },
  colorSelectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  colorOption: {
    width: 60,
    height: 60,
    borderRadius: 30, // Yuvarlak yapmak için
    borderWidth: 2,
    borderColor: 'transparent', // Varsayılan olarak çerçeve görünmez
  },
  colorOptionSelected: {
    borderColor: COLORS.text, // Seçili olunca çerçeveyi görünür yap
    transform: [{ scale: 1.1 }], // Seçili olana hafif bir büyüme efekti
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