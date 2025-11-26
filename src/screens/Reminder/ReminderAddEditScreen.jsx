// src/screens/ReminderAddEditScreen.jsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import { useTranslation } from 'react-i18next';
import ReminderTimeSettingModal from './ReminderTimeSettingModal';
import { scheduleReminderNotifications, cancelReminderNotifications } from '../../utils/notifications';

const ReminderAddEditScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const initialReminder = route.params?.reminder;

  const [title, setTitle] = useState(initialReminder?.title || '');
  const [time, setTime] = useState(initialReminder?.time || '09:00');
  const [location, setLocation] = useState(initialReminder?.location || initialReminder?.locationName || '');
  const [locationCoords, setLocationCoords] = useState(initialReminder?.locationCoords || null);
  const [checklistItems, setChecklistItems] = useState(initialReminder?.checklist || ['']);
  const [isTimeModalVisible, setIsTimeModalVisible] = useState(false);

  const initialDays = { '일': false, '월': false, '화': false, '수': false, '목': false, '금': false, '토': false };
  if (initialReminder?.repeatDays) {
    initialReminder.repeatDays.forEach(day => { initialDays[day] = true; });
  }
  const [selectedDays, setSelectedDays] = useState(initialDays);

  // 표시용: 24시간 문자열(HH:mm)을 AM/PM 형식으로 변환
  const formatDisplayTime = (hhmm) => {
    if (!hhmm || typeof hhmm !== 'string') return hhmm;
    const [hStr, mStr] = hhmm.split(':');
    let h = parseInt(hStr, 10);
    const m = mStr.padStart(2, '0');
    const isAM = h < 12;
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${isAM ? 'AM' : 'PM'} ${String(hour12).padStart(2, '0')} : ${m}`;
  };

  const handleTimeSelected = (newTime, newSelectedDays) => {
    setTime(newTime);
    const updatedDays = { '일': false, '월': false, '화': false, '수': false, '목': false, '금': false, '토': false };
    newSelectedDays.forEach(day => {
      updatedDays[day] = true;
    });
    setSelectedDays(updatedDays);
  };

  const getSelectedDaysText = () => {
    const days = Object.keys(selectedDays).filter(day => selectedDays[day]);
    if (days.length === 0) return t('reminder.no_repeat');
    if (days.length === 7) return t('reminder.everyday');
    return days.join(', ');
  };

  // ---  저장 기능 구현 및 네비게이션 수정 ---
  const handleSaveReminder = async () => {
    if (!title.trim()) {
      Alert.alert(t('reminder.error_title'), t('reminder.title_required'));
      return;
    }

    // 알림 스케줄링 전 기존 알림 취소 (수정 케이스)
    try {
      if (initialReminder?.notificationIds?.length) {
        await cancelReminderNotifications(initialReminder.notificationIds);
      }
    } catch { }

    const newReminder = {
      id: initialReminder ? initialReminder.id : Date.now().toString(),
      title: title.trim(),
      time: time,
      location: location.trim(),
      locationName: location.trim(),
      locationCoords: locationCoords,
      isPremiumLocation: !!location.trim(), // 장소가 있으면 유료 기능으로 간주 (임시)
      checklist: checklistItems.filter(item => item.trim() !== ''),
      repeatDays: Object.keys(selectedDays).filter(day => selectedDays[day]),
      isActive: true,
      createdAt: initialReminder ? initialReminder.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      // 알림 스케줄링 (시간 기반)
      newReminder.notificationIds = await scheduleReminderNotifications(newReminder);

      const REMINDERS_STORAGE_KEY = 'reminders_data';
      const existingReminders = await AsyncStorage.getItem(REMINDERS_STORAGE_KEY);
      let reminders = existingReminders ? JSON.parse(existingReminders) : [];

      const existingIndex = reminders.findIndex(r => r.id === newReminder.id);

      if (existingIndex >= 0) {
        // 기존 항목 수정
        reminders[existingIndex] = newReminder;
      } else {
        // 새 항목 추가
        reminders.push(newReminder);
      }

      await AsyncStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(reminders));

      // 목록 화면으로 돌아가면서 새로고침하도록 파라미터 전달
      navigation.navigate('ReminderMain', { refresh: true });
    } catch (error) {
      console.error('알림 저장 실패:', error);
      Alert.alert(t('reminder.error_title'), t('reminder.save_failed'));
    }
  };

  // (체크리스트 관련 함수들은 생략, 원본 코드와 동일)
  const addChecklistItem = () => setChecklistItems([...checklistItems, '']);
  const handleChecklistItemChange = (text, index) => { /* ... */ };
  const removeChecklistItem = (index) => { /* ... */ };


  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top }]}>
      <Header title={initialReminder ? t('reminder.edit') : t('reminder.new')} showBackButton={true} />
      <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
        <Text style={styles.sectionTitle}>{t('reminder.input_title')}</Text>
        <TextInput style={styles.inputField} value={title} onChangeText={setTitle} placeholder="알림 제목을 입력하세요" />

        <Text style={styles.sectionTitle}>{t('reminder.time_setting')}</Text>
        <TouchableOpacity style={styles.settingButton} onPress={() => setIsTimeModalVisible(true)}>
          <View>
            <Text style={styles.timeText}>{formatDisplayTime(time)}</Text>
            <Text style={styles.daysText}>{getSelectedDaysText()}</Text>
          </View>
          <FontAwesome5 name="chevron-right" size={18} color={Colors.secondaryBrown} />
        </TouchableOpacity>

        {/* 장소 설정 */}
        <Text style={styles.sectionTitle}>{t('reminder.location_setting')}</Text>
        <TouchableOpacity
          style={styles.settingButton}
          onPress={() => navigation.navigate('ReminderLocationSetting', {
            initialLocation: location,
            onLocationSelected: (data) => {
              if (typeof data === 'string') {
                setLocation(data);
                setLocationCoords(null);
              } else if (data && typeof data === 'object') {
                setLocation(data.name || '');
                setLocationCoords(data.coords || null);
              }
            },
          })}
        >
          <View>
            <Text style={styles.daysText}>{location ? location : t('reminder.location_not_set')}</Text>
          </View>
          <FontAwesome5 name="chevron-right" size={18} color={Colors.secondaryBrown} />
        </TouchableOpacity>

        {/* 안내 문구 */}
        <Text style={styles.infoText}>
          {t('reminder.info_text')}
        </Text>

        <Button title={t('reminder.save')} onPress={handleSaveReminder} style={{ marginTop: 40 }} />

      </ScrollView>

      {isTimeModalVisible && (
        <ReminderTimeSettingModal
          initialTime={time}
          onTimeSelected={handleTimeSelected}
          onClose={() => setIsTimeModalVisible(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: Colors.primaryBeige },
  scrollViewContentContainer: { paddingHorizontal: 20, paddingBottom: 40 },
  sectionTitle: { fontSize: FontSizes.large, fontWeight: FontWeights.bold, color: Colors.textDark, marginTop: 25, marginBottom: 10 },
  inputField: { width: '100%', backgroundColor: Colors.textLight, borderRadius: 10, padding: 15, fontSize: FontSizes.medium },
  settingButton: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', backgroundColor: Colors.textLight, borderRadius: 10, padding: 15 },
  timeText: { fontSize: FontSizes.xlarge, fontWeight: FontWeights.bold, color: Colors.textDark },
  daysText: { fontSize: FontSizes.medium, color: Colors.secondaryBrown, marginTop: 5 },
  infoText: { fontSize: FontSizes.medium, color: Colors.secondaryBrown, textAlign: 'center', marginTop: 20 },
});

export default ReminderAddEditScreen;
