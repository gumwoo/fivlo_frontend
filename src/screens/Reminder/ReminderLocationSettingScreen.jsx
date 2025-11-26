// src/screens/ReminderLocationSettingScreen.jsx

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import { useTranslation } from 'react-i18next';

const ReminderLocationSettingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const { initialLocation, onLocationSelected } = route.params;

  const [locationName, setLocationName] = useState(initialLocation || '');
  const [addressInput, setAddressInput] = useState('');
  const [locationRadius, setLocationRadius] = useState(100);
  const mapModuleRef = useRef(null);
  const [mapReady, setMapReady] = useState(null); // null: 로딩중, true: 사용가능, false: 미설치
  const [MapComponents, setMapComponents] = useState(null); // { MapView, Marker, Circle }
  const [selectedCoord, setSelectedCoord] = useState({ latitude: 37.5665, longitude: 126.9780 }); // 서울 시청
  const [region, setRegion] = useState({
    latitude: 37.5665,
    longitude: 126.9780,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  // Kakao Web SDK 키(Expo Go에서 사용)
  const KAKAO_KEY = process.env.EXPO_PUBLIC_KAKAO_CLIENT_SECRET;
  let WebViewComponent = null;
  try {
    // 설치되어 있지 않아도 앱이 깨지지 않도록 require 보호
    WebViewComponent = require('react-native-webview').WebView;
  } catch (e) {
    WebViewComponent = null;
  }

  // react-native-maps는 개발 빌드에서만 사용. Expo Go에서는 Kakao WebView를 우선 사용
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const mod = await import('react-native-maps');
        if (!mounted) return;
        // react-native-maps 는 default로 MapView를 제공하고, Marker/Circle는 named export
        const MapView = mod.default || mod.MapView;
        const { Marker, Circle } = mod;
        mapModuleRef.current = { MapView, Marker, Circle };
        setMapComponents({ MapView, Marker, Circle });
        setMapReady(true);
      } catch (e) {
        setMapReady(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Kakao WebView에 주입할 HTML 생성
  const kakaoHtml = useMemo(() => {
    if (!KAKAO_KEY) return null;
    const lat = region.latitude;
    const lng = region.longitude;
    return `<!DOCTYPE html><html><head><meta charset="utf-8"/><meta name="viewport" content="initial-scale=1, maximum-scale=1"/><style>html,body,#map{margin:0;padding:0;height:100%;}</style><script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_KEY}&libraries=services&autoload=false"></script></head><body><div id="map"></div><script>window.onload=function(){kakao.maps.load(function(){var container=document.getElementById('map');var center=new kakao.maps.LatLng(${lat},${lng});var map=new kakao.maps.Map(container,{center:center,level:4});var marker=new kakao.maps.Marker({position:center});marker.setMap(map);var circle=new kakao.maps.Circle({center:center,radius:${locationRadius},strokeWeight:2,strokeColor:'#FFC400',strokeOpacity:0.9,fillColor:'rgba(255,196,0,0.15)',fillOpacity:0.7});circle.setMap(map);kakao.maps.event.addListener(map,'click',function(mouseEvent){var ll=mouseEvent.latLng;marker.setPosition(ll);circle.setOptions({center:ll});if(window.ReactNativeWebView){window.ReactNativeWebView.postMessage(JSON.stringify({type:'select',lat:ll.getLat(),lng:ll.getLng()}));}});});};</script></body></html>`;
  }, [KAKAO_KEY, region, locationRadius]);

  const handleSaveLocation = async () => {
    if (!locationName.trim() && !addressInput.trim()) {
      Alert.alert(t('reminder.location_required_title'), t('reminder.location_required_message'));
      return;
    }

    const finalLocation = locationName.trim() || addressInput.trim();

    try {
      if (onLocationSelected) {
        onLocationSelected({ name: finalLocation, coords: selectedCoord, radius: locationRadius });
      }
      Alert.alert(t('reminder.location_saved_title'), t('reminder.location_saved_message', { name: finalLocation }));
      navigation.goBack();
    } catch (error) {
      console.error('위치 저장 실패:', error);
      Alert.alert(t('common.error'), t('reminder.location_save_error'));
    }
  };

  const handleChipPress = (location) => {
    setLocationName(t(`reminder.chips.${location}`));
  };

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top }]}>
      <Header title={t('reminder.location_setting')} showBackButton={true} />
      <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
        <Text style={styles.sectionTitle}>{t('reminder.location_name_label')}</Text>
        <TextInput style={styles.inputField} placeholder={t('reminder.location_name_placeholder')} value={locationName} onChangeText={setLocationName} />

        {/* 빠른 선택 칩 */}
        <View style={styles.chipsRow}>
          {['home', 'company', 'school'].map((key) => (
            <TouchableOpacity key={key} style={[styles.chip, locationName === t(`reminder.chips.${key}`) && styles.chipSelected]} onPress={() => handleChipPress(key)}>
              <Text style={[styles.chipText, locationName === t(`reminder.chips.${key}`) && styles.chipTextSelected]}>{t(`reminder.chips.${key}`)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>{t('reminder.address_label')}</Text>
        <TextInput style={styles.inputField} placeholder={t('reminder.address_placeholder')} value={addressInput} onChangeText={setAddressInput} />

        {/* 1순위: Kakao WebView (키가 있으면 우선 사용) */}
        {KAKAO_KEY && WebViewComponent && kakaoHtml && (
          <View style={styles.mapBox}>
            <WebViewComponent
              originWhitelist={["*"]}
              source={{ html: kakaoHtml, baseUrl: 'https://localhost' }}
              onMessage={(e) => {
                try {
                  const data = JSON.parse(e.nativeEvent.data);
                  if (data?.type === 'select') {
                    setSelectedCoord({ latitude: data.lat, longitude: data.lng });
                  }
                } catch (err) { }
              }}
            />
          </View>
        )}

        {/* 2순위: react-native-maps (개발 빌드 또는 Expo Go에서도 설치되면 표시) */}
        {!KAKAO_KEY && mapReady === true && MapComponents?.MapView && (
          <View style={styles.mapBox}>
            <MapComponents.MapView
              style={StyleSheet.absoluteFill}
              initialRegion={region}
              onRegionChangeComplete={setRegion}
              onPress={(e) => setSelectedCoord(e.nativeEvent.coordinate)}
            >
              <MapComponents.Marker coordinate={selectedCoord} />
              <MapComponents.Circle
                center={selectedCoord}
                radius={locationRadius}
                strokeColor={Colors.accentApricot}
                fillColor="rgba(255, 196, 0, 0.15)"
              />
            </MapComponents.MapView>
          </View>
        )}

        {/* 로딩/플레이스홀더 */}
        {mapReady === null && (
          <View style={styles.mapPlaceholder}>
            <ActivityIndicator color={Colors.secondaryBrown} />
            <Text style={[styles.mapPlaceholderText, { marginTop: 8 }]}>{t('reminder.map_loading')}</Text>
          </View>
        )}
        {(mapReady === false && KAKAO_KEY && !WebViewComponent) && (
          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapPlaceholderText}>{t('reminder.webview_required')}</Text>
            <Text style={[styles.mapPlaceholderText, { marginTop: 8 }]}>{t('reminder.webview_install_guide')}</Text>
          </View>
        )}
        {mapReady === false && !KAKAO_KEY && (
          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapPlaceholderText}>{t('reminder.map_placeholder')}</Text>
            <Text style={styles.mapRadiusText}>{t('reminder.map_radius')}</Text>
            <Text style={[styles.mapPlaceholderText, { marginTop: 8 }]}>{t('reminder.maps_install_guide')}</Text>
          </View>
        )}

        <Button title={t('reminder.save_location')} onPress={handleSaveLocation} style={styles.saveButton} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: Colors.primaryBeige, },
  scrollViewContentContainer: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 10, alignItems: 'center', },
  sectionTitle: { fontSize: FontSizes.large, fontWeight: FontWeights.bold, color: Colors.textDark, marginTop: 25, marginBottom: 10, width: '100%', textAlign: 'left', },
  inputField: { width: '100%', backgroundColor: Colors.textLight, borderRadius: 10, padding: 15, fontSize: FontSizes.medium, color: Colors.textDark, },
  mapPlaceholder: { width: '100%', height: 300, backgroundColor: Colors.textLight, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 20, marginBottom: 30, borderWidth: 1, borderColor: Colors.secondaryBrown, position: 'relative', },
  mapBox: { width: '100%', height: 300, borderRadius: 10, overflow: 'hidden', backgroundColor: Colors.textLight, marginTop: 20, marginBottom: 30 },
  mapPlaceholderText: { fontSize: FontSizes.medium, color: Colors.secondaryBrown, textAlign: 'center', },
  mapRadiusText: { position: 'absolute', bottom: 10, right: 10, fontSize: FontSizes.small, color: Colors.secondaryBrown, },
  saveButton: { width: '100%', },
  chipsRow: { flexDirection: 'row', width: '100%', marginTop: 10, },
  chip: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 18, backgroundColor: Colors.primaryBeige, borderWidth: 1, borderColor: Colors.secondaryBrown, marginRight: 8 },
  chipSelected: { backgroundColor: Colors.accentApricot, borderColor: Colors.accentApricot },
  chipText: { color: Colors.secondaryBrown },
  chipTextSelected: { color: Colors.textLight, fontWeight: FontWeights.bold },
});


export default ReminderLocationSettingScreen;
