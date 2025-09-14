// src/screens/MapScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Searchbar, FAB } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Region } from 'react-native-maps';
import { COLORS } from '../constants/colors';
import { MapScreenProps } from '../navigation/types';
import * as Location from 'expo-location';

const MapScreen: React.FC<MapScreenProps> = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const [region, setRegion] = useState<Region | undefined>(undefined);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // Bu fonksiyon, component ilk yüklendiğinde çalışacak
    (async () => {
      // 1. Kullanıcıdan konum izni iste
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        // İzin verilmezse haritayı varsayılan bir konuma (İstanbul) ayarlayalım
        setRegion({
          latitude: 41.015137,
          longitude: 28.979530,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
        return;
      }

      // 2. İzin verildiyse, kullanıcının mevcut konumunu al
      try {
        let location = await Location.getCurrentPositionAsync({});
        const current_location = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setUserLocation(current_location);
        setRegion({
          ...current_location,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } catch (error) {
        setErrorMsg('Could not fetch location.');
        // Hata durumunda da varsayılan konuma ayarla
        setRegion({
          latitude: 41.015137,
          longitude: 28.979530,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    })();
  }, []);

  if (!region) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text>Fetching your location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        mapType='terrain'
        region={region}
        onRegionChangeComplete={setRegion}
      >
        {userLocation && (
          <Marker
            coordinate={userLocation}
            title="Your Location"
            pinColor="blue"
          />
        )}
      </MapView>

      {/* Arama çubuğunu haritanın üzerine konumlandırmak için SafeAreaView kullanıyoruz */}
      <SafeAreaView style={styles.uiContainer}>
        <Searchbar
          placeholder="Search for a city..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
        {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
      </SafeAreaView>

      {/* Yeni şehir ekleme butonu */}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => console.log('FAB pressed')}
        color={COLORS.white}
        theme={{ colors: { accent: COLORS.primary } }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject, // Haritayı tüm ekrana yay
  },
  uiContainer: {
    // Bu container, arama çubuğu gibi UI elemanlarını güvenli alana yerleştirir
    // ve diğer elementleri etkilemez.
    position: 'absolute',
    width: '100%',
    paddingHorizontal: 20,
  },
  searchbar: {
    marginTop: 10,
    elevation: 2, // Android için gölge
    shadowColor: '#000', // iOS için gölge
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.primary
  },
});

export default MapScreen;