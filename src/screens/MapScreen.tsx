// src/screens/MapScreen.tsx
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Animated, Keyboard } from 'react-native';
import { Searchbar, FAB, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Region, Polygon } from 'react-native-maps';
import { COLORS } from '../constants/colors';
import { MapScreenProps } from '../navigation/types';
import * as Location from 'expo-location';
import { searchCityByName } from '../api/geolocationService';
import { useAuth } from '../context/AuthContext';

const MapScreen: React.FC<MapScreenProps> = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [region, setRegion] = useState<Region | undefined>(undefined);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchedPolygon, setSearchedPolygon] = useState<{ latitude: number; longitude: number; }[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const cancelButtonAnim = useRef(new Animated.Value(0)).current;
  const mapRef = useRef<MapView>(null);
  const { authState } = useAuth();
  const { themeColor } = authState;

    const hexToRgba = (hex: string, alpha: number) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const handleFocus = () => {
    setIsSearchFocused(true);
    // Animasyonu başlat: 300ms içinde değeri 1 yap (görünür)
    Animated.timing(cancelButtonAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true, // Performans için
    }).start();
  };

  const handleCancel = () => {
    Keyboard.dismiss(); // Klavyeyi kapat
    setSearchQuery(''); // Arama metnini temizle
    setIsSearchFocused(false);
    // Animasyonu başlat: 300ms içinde değeri 0 yap (gizli)
    Animated.timing(cancelButtonAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  const handleSearch = async () => {
    if (searchQuery.trim() === '') return;

    Keyboard.dismiss();
    setIsSearching(true);
    setSearchedPolygon([]);
    setErrorMsg(null);

    // 1. Servis fonksiyonunu çağır
    const locationData = await searchCityByName(searchQuery);
    
    setIsSearching(false);

    // 2. Gelen sonucu kontrol et ve state'leri güncelle
    if (locationData) {
      if (locationData.hasBoundary) {
        setSearchedPolygon(locationData.coordinates);
        // Haritayı bu koordinatlara sığacak şekilde odakla
        mapRef.current?.fitToCoordinates(locationData.coordinates, {
          edgePadding: { top: 150, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
      } else {
        // Sınır verisi yoksa, sadece merkeze odaklan
        mapRef.current?.animateToRegion({
          ...locationData.center,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }, 1000);
        setErrorMsg("Boundary data not found, showing center point.");
      }
    } else {
      setErrorMsg('Location not found or an error occurred.');
    }
  };
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
        ref={mapRef}
        style={styles.map}
        mapType="terrain"
        region={region}
        onRegionChangeComplete={setRegion}
      >
        {userLocation && <Marker coordinate={userLocation} title="Your Location" pinColor="blue" />}
        {searchedPolygon.length > 0 && (
          <Polygon
            coordinates={searchedPolygon}
            strokeColor={themeColor} 
            fillColor={hexToRgba(themeColor, 0.4)}
            strokeWidth={3}
          />
        )}
      </MapView>

      {/* Arama çubuğunu haritanın üzerine konumlandırmak için SafeAreaView kullanıyoruz */}
      <SafeAreaView style={styles.uiContainer}>
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Search for a city..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={[styles.searchbar, isSearchFocused && styles.searchbarFocused]} // Odaklanınca stili değiştir
            onIconPress={handleSearch}
            onSubmitEditing={handleSearch}
            loading={isSearching}
            onFocus={handleFocus} // Odaklandığında handleFocus'u çağır
            onBlur={() => {
              // Eğer input boşsa ve odaktan çıkılırsa cancel'ı gizle
              if (searchQuery.trim() === '') {
                handleCancel();
              }
            }}
          />
          {isSearchFocused && (
            <Animated.View style={{
              opacity: cancelButtonAnim, // Opaklığı animasyon değerine bağla
              transform: [{
                // Sağa doğru kayarak gelmesi için animasyon
                translateX: cancelButtonAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                })
              }]
            }}>
              <Button
                onPress={handleCancel}
                color={COLORS.primary}
                style={styles.cancelButton}
                labelStyle={styles.cancelButtonText}
              >
                Cancel
              </Button>
            </Animated.View>
          )}
        </View>
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
    ...StyleSheet.absoluteFillObject,
  },
  uiContainer: {
    position: 'absolute',
    width: '100%',
    paddingHorizontal: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  searchbar: {
    flex: 1,
    marginTop: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    transition: 'flex 0.3s ease-in-out',
  },
  searchbarFocused: {
    flex: 1,
  },
  cancelButton: {
    marginLeft: 6,
    marginTop: 6,
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: COLORS.darkGreen,
    fontWeight: '600',
    fontSize: 16
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