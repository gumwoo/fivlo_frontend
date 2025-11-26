// src/screens/ReminderScreen.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ScrollView, Switch } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Header from '../../components/common/Header';
import { useTranslation } from 'react-i18next';
import { scheduleReminderNotifications, cancelReminderNotifications } from '../../utils/notifications';

const ReminderScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const { t } = useTranslation();

  const [reminders, setReminders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const REMINDERS_STORAGE_KEY = 'reminders_data';

  const formatDisplayTime = (hhmm) => {
    if (!hhmm || typeof hhmm !== 'string') return hhmm;
    const [hStr, mStr] = hhmm.split(':');
    let h = parseInt(hStr, 10);
    const m = (mStr || '00').padStart(2, '0');
    const isAM = h < 12;
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${isAM ? 'AM' : 'PM'} ${String(hour12).padStart(2, '0')} : ${m}`;
  };

  const loadReminders = useCallback(async (force = false) => {
    if (isLoading && !force) return;
    setIsLoading(true);

    try {
      const storedReminders = await AsyncStorage.getItem(REMINDERS_STORAGE_KEY);
      const remindersData = storedReminders ? JSON.parse(storedReminders) : [];
      setReminders(remindersData);
    } catch (error) {
      console.error('알림 데이터 로드 실패:', error);
      Alert.alert(t('reminder.error_title'), t('reminder.load_failed'));
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  useEffect(() => {
    // 화면이 포커스될 때마다 새로고침 파라미터를 확인하여 데이터를 다시 로드합니다.
    if (isFocused) {
      const state = navigation.getState();
      const currentRoute = state.routes[state.index];
      if (currentRoute.params?.refresh) {
        loadReminders(true);
        navigation.setParams({ refresh: false });
      }
    }
  }, [isFocused, navigation, loadReminders]);

  // 최초 진입 시 데이터 로드
  useEffect(() => {
    loadReminders(true);
  }, []);

  // ---  [기능 추가] 알림 ON/OFF 상태를 저장하는 함수 ---
  const handleToggleActive = async (reminderId, newIsActive) => {
    try {
      let updatedReminders = reminders.map(reminder => reminder);
      const idx = reminders.findIndex(r => r.id === reminderId);
      if (idx < 0) return;
      const target = { ...reminders[idx] };
      target.isActive = newIsActive;
      target.updatedAt = new Date().toISOString();
      if (!newIsActive && target.notificationIds?.length) {
        await cancelReminderNotifications(target.notificationIds);
        target.notificationIds = [];
      }
      if (newIsActive) {
        target.notificationIds = await scheduleReminderNotifications(target);
      }
      updatedReminders = [...reminders];
      updatedReminders[idx] = target;
      setReminders(updatedReminders); // UI 즉시 반영
      await AsyncStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(updatedReminders)); // 변경사항 저장
    } catch (error) {
      console.error('알림 상태 변경 실패:', error);
      Alert.alert(t('reminder.error_title'), t('reminder.change_failed'));
    }
  };

  // --- 💬 [기능 확인] 알림 '수정' 페이지로 이동하는 기능 ---
  const handleEditReminder = (reminder) => {
    navigation.navigate('ReminderAddEdit', { reminder: reminder });
  };

  const handleDeleteReminder = async (reminderId) => {
    Alert.alert(
      t('reminder.delete_title'),
      t('reminder.delete_message'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('reminder.delete_confirm'),
          style: 'destructive',
          onPress: async () => {
            try {
              const target = reminders.find(r => r.id === reminderId);
              if (target?.notificationIds?.length) {
                await cancelReminderNotifications(target.notificationIds);
              }
              const updated = reminders.filter(r => r.id !== reminderId);
              setReminders(updated);
              await AsyncStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(updated));
            } catch (e) {
              console.error('알림 삭제 실패:', e);
              Alert.alert(t('reminder.error_title'), t('reminder.change_failed'));
            }
          }
        },
      ]
    );
  };

  // --- 💬 [기능 확인] 알림 '추가' 페이지로 이동하는 기능 ---
  const handleAddReminder = () => {
    navigation.navigate('ReminderAddEdit', { reminder: null });
  };

  const renderReminderItem = ({ item }) => {
    return (
      <View style={styles.reminderItemContainer}>
        {/* 알림 제목, 시간, 장소를 누르면 '수정' 페이지로 이동 */}
        <TouchableOpacity
          style={styles.reminderContent}
          onPress={() => handleEditReminder(item)}
          onLongPress={() => navigation.navigate('ReminderChecklistOverlay', { reminderTitle: item.title, items: item.checklist?.length ? item.checklist : (t('reminder.default_checklist', { returnObjects: true })) })}
        >
          <Text style={styles.reminderTitle}>{item.title}</Text>
          <View style={styles.reminderDetails}>
            <FontAwesome5 name="clock" size={14} color={Colors.secondaryBrown} />
            <Text style={styles.reminderTime}>{formatDisplayTime(item.time)}</Text>
          </View>
          <View style={styles.reminderDetails}>
            <FontAwesome5 name="map-marker-alt" size={14} color={Colors.secondaryBrown} />
            <Text style={styles.reminderLocationText}>
              {item.locationName || item.location || t('reminder.location_not_set')}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.itemActions}>
          {/* Drag handle icon (디자인용) */}
          <FontAwesome5 name="bars" size={18} color={Colors.secondaryBrown} style={{ marginRight: 12 }} />
          {/* --- ✨ 알림 ON/OFF 토글 --- */}
          <Switch
            trackColor={{ false: '#767577', true: Colors.accentApricot }}
            thumbColor={item.isActive ? Colors.primaryBeige : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={(newValue) => handleToggleActive(item.id, newValue)}
            value={item.isActive}
          />
          {/* 삭제 아이콘 */}
          <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteReminder(item.id)}>
            <FontAwesome5 name="times" size={18} color={Colors.secondaryBrown} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top }]}>
      <Header title={t('reminder.title')} showBackButton={true} />
      <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
        {reminders.length > 0 ? (
          <FlatList
            data={reminders}
            renderItem={renderReminderItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.noRemindersText}>{t('reminder.empty_list')}</Text>
          </View>
        )}
      </ScrollView>

      {/* --- 💬 [기능 확인] '+' 버튼을 누르면 '추가' 페이지로 이동 --- */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddReminder}>
        <FontAwesome5 name="plus" size={24} color={Colors.textLight} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: Colors.primaryBeige },
  scrollViewContentContainer: { paddingHorizontal: 20, paddingBottom: 100 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100 },
  noRemindersText: { fontSize: FontSizes.medium, color: Colors.secondaryBrown, textAlign: 'center' },
  reminderItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.textLight,
    borderRadius: 15,
    padding: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  reminderContent: {
    flex: 1,
    marginRight: 15,
  },
  reminderTitle: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 8,
  },
  reminderDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  reminderTime: {
    fontSize: FontSizes.medium,
    color: Colors.secondaryBrown,
    marginLeft: 8,
  },
  reminderLocationText: {
    fontSize: FontSizes.medium,
    color: Colors.secondaryBrown,
    marginLeft: 8,
  },
  addButton: {
    position: 'absolute',
    bottom: 100, // 탭바 위에 보이도록 여백 확보
    alignSelf: 'center',
    backgroundColor: '#E6E6E6',
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    zIndex: 1000,
  },
  itemActions: { flexDirection: 'row', alignItems: 'center' },
  deleteButton: { marginLeft: 12, padding: 6 },
});

export default ReminderScreen;
