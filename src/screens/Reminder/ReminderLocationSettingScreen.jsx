// src/screens/ReminderLocationSettingScreen.jsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

  // --- ✨ [수정] 앱을 방해하던 위치 시뮬레이션 및 알림 관련 useEffect, 함수 전체 삭제 ---

  const handleSaveLocation = async () => {
    if (!locationName.trim() && !addressInput.trim()) {
      Alert.alert(t('reminder.location_required_title'), t('reminder.location_required_message'));
      return;
    }
    
    const finalLocation = locationName.trim() || addressInput.trim();
    
    // (이하 저장 로직은 원본과 동일)
    try {
      if (onLocationSelected) {
        onLocationSelected(finalLocation);
      }
      Alert.alert(t('reminder.location_saved_title'), t('reminder.location_saved_message', { name: finalLocation }));
      navigation.goBack();
    } catch (error) {
      console.error('위치 저장 실패:', error);
      Alert.alert('오류', '위치 저장에 실패했습니다.');
    }
  };

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top }]}>
      <Header title={t('reminder.location_setting')} showBackButton={true} />
      <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
        <Text style={styles.sectionTitle}>{t('reminder.location_name_label')}</Text>
        <TextInput style={styles.inputField} placeholder={t('reminder.location_name_placeholder')} value={locationName} onChangeText={setLocationName} />

        <Text style={styles.sectionTitle}>{t('reminder.address_label')}</Text>
        <TextInput style={styles.inputField} placeholder={t('reminder.address_placeholder')} value={addressInput} onChangeText={setAddressInput} />
        
        <View style={styles.mapPlaceholder}>
            <Text style={styles.mapPlaceholderText}>{t('reminder.map_placeholder')}</Text>
            <Text style={styles.mapRadiusText}>{t('reminder.map_radius')}</Text>
        </View>

        <Button title={t('reminder.save_location')} onPress={handleSaveLocation} style={styles.saveButton} />
      </ScrollView>
    </View>
  );
};

// (스타일 코드는 유지)
const styles = StyleSheet.create({
    screenContainer: { flex: 1, backgroundColor: Colors.primaryBeige, },
    scrollViewContentContainer: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 10, alignItems: 'center', },
    sectionTitle: { fontSize: FontSizes.large, fontWeight: FontWeights.bold, color: Colors.textDark, marginTop: 25, marginBottom: 10, width: '100%', textAlign: 'left', },
    inputField: { width: '100%', backgroundColor: Colors.textLight, borderRadius: 10, padding: 15, fontSize: FontSizes.medium, color: Colors.textDark, },
    mapPlaceholder: { width: '100%', height: 250, backgroundColor: Colors.textLight, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 20, marginBottom: 30, borderWidth: 1, borderColor: Colors.secondaryBrown, position: 'relative', },
    mapPlaceholderText: { fontSize: FontSizes.medium, color: Colors.secondaryBrown, textAlign: 'center', },
    mapRadiusText: { position: 'absolute', bottom: 10, right: 10, fontSize: FontSizes.small, color: Colors.secondaryBrown, },
    saveButton: { width: '100%', },
});


export default ReminderLocationSettingScreen;