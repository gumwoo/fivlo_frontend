// src/screens/HomeScreen.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView, Modal } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { format, addDays, subDays } from 'date-fns';
import { ko } from 'date-fns/locale/ko';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { Colors } from '../styles/color';
import { FontSizes, FontWeights } from '../styles/Fonts';
import Button from '../components/common/Button';
const HomeScreen = ({ isPremiumUser }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const { t } = useTranslation();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [coins, setCoins] = useState(1234);
  const [showCoinGrantModal, setShowCoinGrantModal] = useState(false);
  const [obooniImage, setObooniImage] = useState(require('../../assets/images/오분이몸.png'));

  const mockTasks = [
    { id: '1', text: t('task_calendar.sample_tasks.water'), completed: false, category: t('home.categories.daily'), color: Colors.primaryBeige },
    { id: '2', text: t('task_calendar.sample_tasks.morning_exercise'), completed: false, category: t('home.categories.exercise'), color: '#FFABAB' },
    { id: '3', text: t('task_calendar.sample_tasks.app_dev'), completed: false, category: t('home.categories.reading'), color: '#99DDFF' },
    { id: '4', text: t('task_calendar.sample_tasks.app_dev'), completed: true, category: t('home.categories.study'), color: '#A0FFC3' },
  ];

  useEffect(() => {
    setTasks(mockTasks.slice(0, 3));
  }, [currentDate]);

  useEffect(() => {
    if (tasks.length > 0 && tasks.every(task => task.completed)) {
      setTimeout(() => setShowCoinGrantModal(true), 500);
    }
  }, [tasks]);

  const goToPreviousDay = () => setCurrentDate(subDays(currentDate, 1));
  const goToNextDay = () => setCurrentDate(addDays(currentDate, 1));
  
  // 선택된 옷 확인
  useEffect(() => {
    if (isFocused) {
      try {
        const { mockObooniState } = require('./Obooni/ObooniShopScreen');
        const selectedClothes = mockObooniState.selectedClothes;
        if (selectedClothes && selectedClothes.wornImage) {
          setObooniImage(selectedClothes.wornImage);
        } else {
          setObooniImage(require('../../assets/images/오분이몸.png'));
        }
      } catch (error) {
        // 모듈을 불러올 수 없으면 기본 이미지 사용
        setObooniImage(require('../../assets/images/오분이몸.png'));
      }
    }
  }, [isFocused]);
  
  const toggleTaskCompletion = (id) => {
    setTasks(prev =>
      prev.map(task => (task.id === id ? { ...task, completed: !task.completed } : task))
    );
  };

  const handleGoToTaskCalendar = () => navigation.navigate('TaskCalendar');

  const handleObooniPress = () =>
    navigation.navigate('ObooniCustomization', { isPremiumUser });

  const renderTaskItem = ({ item }) => (
    // 아이템 전체를 눌러도 체크 토글
    <TouchableOpacity
      style={styles.taskItem}
      activeOpacity={0.7}
      onPress={() => toggleTaskCompletion(item.id)}
    >
      <View style={styles.checkboxContainer}>
        {item.completed ? (
          <FontAwesome name="check-square" size={24} color={Colors.accentApricot} />
        ) : (
          <FontAwesome name="square-o" size={24} color={Colors.secondaryBrown} />
        )}
      </View>
      <Text style={[styles.taskText, item.completed && styles.taskTextCompleted]}>
        {item.text}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
        <View style={styles.dateNavigationContainer}>
          <TouchableOpacity onPress={goToPreviousDay} style={styles.dateNavButton}>
            <Text style={styles.dateNavButtonText}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.currentDateText}>
            {format(currentDate, t('calendar.date_format'), { locale: ko })}
          </Text>
          <TouchableOpacity onPress={goToNextDay} style={styles.dateNavButton}>
            <Text style={styles.dateNavButtonText}>{'>'}</Text>
          </TouchableOpacity>
        </View>

        {isPremiumUser && (
          <View style={styles.coinDisplayContainer}>
            <Text style={styles.coinText}>{coins}</Text>
            <FontAwesome name="dollar" size={FontSizes.medium} color={Colors.accentApricot} />
          </View>
        )}

        <TouchableOpacity onPress={handleObooniPress}>
          <Image source={obooniImage} style={styles.obooniCharacter} />
        </TouchableOpacity>

        <View style={styles.taskListContainer}>
          <View style={styles.taskListHeader}>
            <Text style={styles.taskListTitle}>{t('home.today_tasks')}</Text>
            <TouchableOpacity onPress={handleGoToTaskCalendar} style={styles.addTaskButton}>
              <FontAwesome name="plus" size={20} color={Colors.textLight} />
            </TouchableOpacity>
          </View>

          {tasks.length > 0 ? (
            <FlatList
              data={tasks}
              renderItem={renderTaskItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          ) : (
            <TouchableOpacity onPress={handleGoToTaskCalendar} style={styles.noTaskContainer}>
              <Text style={styles.noTaskText}>{t('home.no_tasks')}</Text>
              <FontAwesome name="plus-circle" size={30} color={Colors.secondaryBrown} />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent
        visible={showCoinGrantModal}
        onRequestClose={() => setShowCoinGrantModal(false)}
      >
        <View style={styles.coinModalOverlay}>
          <View style={styles.coinModalContent}>
            <Image source={require('../../assets/coin.png')} style={styles.modalCoinImage} />
            <Text style={styles.modalMessage}>{t('home.completion_modal_message')}</Text>
            <Button title={t('common.ok')} onPress={() => setShowCoinGrantModal(false)} style={styles.modalButton} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primaryBeige },
  scrollViewContentContainer: { alignItems: 'center', paddingBottom: 100 },
  dateNavigationContainer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    width: '90%', paddingVertical: 15, marginTop: 20,
  },
  dateNavButton: { paddingHorizontal: 15, paddingVertical: 5 },
  dateNavButtonText: { fontSize: FontSizes.extraLarge, fontWeight: FontWeights.bold, color: Colors.secondaryBrown },
  currentDateText: { fontSize: FontSizes.large, fontWeight: FontWeights.bold, color: Colors.textDark },

  coinDisplayContainer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end',
    width: '90%', paddingVertical: 8, paddingHorizontal: 15, marginBottom: 10,
    backgroundColor: Colors.textLight, borderRadius: 15, elevation: 2,
  },
  coinText: { fontSize: FontSizes.medium, fontWeight: FontWeights.bold, color: Colors.textDark, marginRight: 5 },

  obooniCharacter: { width: 250, height: 250, marginVertical: 20, resizeMode: 'contain' },

  // 🔧 카드: 흰색 → 반투명 회색
  taskListContainer: {
    width: '90%',
    backgroundColor: 'rgba(0,0,0,0.06)',  // 반투명 회색
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  taskListHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  taskListTitle: { fontSize: FontSizes.large, fontWeight: FontWeights.bold, color: Colors.textDark },

  addTaskButton: {
    backgroundColor: Colors.accentApricot, width: 40, height: 40, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center', elevation: 3,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3,
  },

  taskItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  checkboxContainer: { marginRight: 15 },
  taskText: { fontSize: FontSizes.medium, color: Colors.textDark, flex: 1 },
  taskTextCompleted: { textDecorationLine: 'line-through', color: Colors.secondaryBrown },

  noTaskContainer: { alignItems: 'center', paddingVertical: 50 },
  noTaskText: { fontSize: FontSizes.medium, color: Colors.secondaryBrown, textAlign: 'center', marginBottom: 10 },

  coinModalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' },
  coinModalContent: { backgroundColor: Colors.textLight, borderRadius: 20, padding: 30, alignItems: 'center', width: '80%', elevation: 10 },
  modalCoinImage: { width: 150, height: 150, resizeMode: 'contain', marginBottom: 20 },
  modalMessage: { fontSize: FontSizes.large, fontWeight: FontWeights.bold, color: Colors.textDark, textAlign: 'center', marginBottom: 30, lineHeight: 28 },
  modalButton: { width: '70%' },
});

export default HomeScreen;
