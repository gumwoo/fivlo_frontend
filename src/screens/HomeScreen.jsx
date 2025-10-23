import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format, addDays, subDays } from 'date-fns';
import { ko } from 'date-fns/locale/ko';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { Colors } from '../styles/color';
import { FontSizes, FontWeights } from '../styles/Fonts';
import Button from '../components/common/Button';
import useTaskStore from '../store/taskStore'; //  전역 task 상태 사용

const HomeScreen = ({ isPremiumUser }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const { t } = useTranslation();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [coins, setCoins] = useState(1234);
  const [showCoinGrantModal, setShowCoinGrantModal] = useState(false);
  const [obooniImage, setObooniImage] = useState(require('../../assets/images/오분이몸.png'));

  //  전역 상태 가져오기
  const tasks = useTaskStore((state) => state.tasks);
  const updateTask = useTaskStore((state) => state.updateTask);

  const dateKey = format(currentDate, 'yyyy-MM-dd');
  const tasksForDate = tasks[dateKey] || [];

  //  체크 토글 → 상태 유지
  const toggleTaskCompletion = (id) => {
    updateTask(dateKey, id, { completed: !tasksForDate.find((t) => t.id === id)?.completed });
  };

  const goToPreviousDay = () => setCurrentDate(subDays(currentDate, 1));
  const goToNextDay = () => setCurrentDate(addDays(currentDate, 1));

  //  옷 상태 반영 (기존 로직 유지)
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
        setObooniImage(require('../../assets/images/오분이몸.png'));
      }
    }
  }, [isFocused]);

//  모든 Task 완료 시 코인 지급 (처음 한 번만)
useEffect(() => {
  const checkAndShowModal = async () => {
    const today = format(currentDate, 'yyyy-MM-dd');
    const shownKey = `coinModalShown_${today}`; // 날짜별 저장 키
    const alreadyShown = await AsyncStorage.getItem(shownKey);

    // 모든 task 완료 + 아직 모달 안 띄운 경우만 실행
    if (tasksForDate.length > 0 && tasksForDate.every((task) => task.completed) && !alreadyShown) {
      await AsyncStorage.setItem(shownKey, 'true'); // 하루 1회만
      setTimeout(() => setShowCoinGrantModal(true), 400);
    }
  };

  checkAndShowModal();
}, [tasksForDate]);


  const handleGoToTaskCalendar = () => navigation.navigate('TaskCalendar');
  const handleObooniPress = () =>
    navigation.navigate('ObooniCustomization', { isPremiumUser });

  const renderTaskItem = ({ item }) => (
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
        {/* 날짜 네비게이션 */}
        <View style={styles.dateNavigationContainer}>
          <TouchableOpacity onPress={goToPreviousDay} style={styles.dateNavButton}>
            <Text style={styles.dateNavButtonText}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.currentDateText}>
            {format(currentDate, 'yyyy년 M월 d일 EEEE', { locale: ko })}
          </Text>
          <TouchableOpacity onPress={goToNextDay} style={styles.dateNavButton}>
            <Text style={styles.dateNavButtonText}>{'>'}</Text>
          </TouchableOpacity>
        </View>

        {/* 코인 */}
        {isPremiumUser && (
          <View style={styles.coinDisplayContainer}>
            <Text style={styles.coinText}>{coins}</Text>
            <FontAwesome name="dollar" size={FontSizes.medium} color={Colors.accentApricot} />
          </View>
        )}

        {/* 오분이 캐릭터 */}
        <TouchableOpacity onPress={handleObooniPress}>
          <Image source={obooniImage} style={styles.obooniCharacter} />
        </TouchableOpacity>

        {/* 오늘의 일정 */}
        <View style={styles.taskListContainer}>
          <View style={styles.taskListHeader}>
            <Text style={styles.taskListTitle}>{t('home.today_tasks', '오늘의 일정')}</Text>
            <TouchableOpacity onPress={handleGoToTaskCalendar} style={styles.addTaskButton}>
              <FontAwesome name="plus" size={20} color={Colors.textLight} />
            </TouchableOpacity>
          </View>

          {/*  전역 상태 기반 일정 표시 */}
          {tasksForDate.length > 0 ? (
            <FlatList
              data={tasksForDate}
              renderItem={renderTaskItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          ) : (
            <TouchableOpacity
              onPress={handleGoToTaskCalendar}
              style={styles.noTaskContainer}
            >
              <Text style={styles.noTaskText}>{t('home.no_tasks', '등록된 일정이 없습니다')}</Text>
              <FontAwesome name="plus-circle" size={30} color={Colors.secondaryBrown} />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* 코인 획득 모달 */}
      <Modal
        animationType="fade"
        transparent
        visible={showCoinGrantModal}
        onRequestClose={() => setShowCoinGrantModal(false)}
      >
        <View style={styles.coinModalOverlay}>
          <View style={styles.coinModalContent}>
            <Image source={require('../../assets/coin.png')} style={styles.modalCoinImage} />
            <Text style={styles.modalMessage}>
              {t('home.completion_modal_message', '오늘의 모든 목표를 완료했어요!')}
            </Text>
            <Button
              title={t('common.ok', '확인')}
              onPress={() => setShowCoinGrantModal(false)}
              style={styles.modalButton}
            />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    paddingVertical: 15,
    marginTop: 20,
  },
  dateNavButton: { paddingHorizontal: 15, paddingVertical: 5 },
  dateNavButtonText: {
    fontSize: FontSizes.extraLarge,
    fontWeight: FontWeights.bold,
    color: Colors.secondaryBrown,
  },
  currentDateText: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
  },

  coinDisplayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '90%',
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
    backgroundColor: Colors.textLight,
    borderRadius: 15,
    elevation: 2,
  },
  coinText: {
    fontSize: FontSizes.medium,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginRight: 5,
  },

  obooniCharacter: {
    width: 250,
    height: 250,
    marginVertical: 20,
    resizeMode: 'contain',
  },

  taskListContainer: {
    width: '90%',
    backgroundColor: 'rgba(0,0,0,0.06)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  taskListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  taskListTitle: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
  },
  addTaskButton: {
    backgroundColor: Colors.accentApricot,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },

  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  checkboxContainer: { marginRight: 15 },
  taskText: { fontSize: FontSizes.medium, color: Colors.textDark, flex: 1 },
  taskTextCompleted: { textDecorationLine: 'line-through', color: Colors.secondaryBrown },

  noTaskContainer: { alignItems: 'center', paddingVertical: 50 },
  noTaskText: {
    fontSize: FontSizes.medium,
    color: Colors.secondaryBrown,
    textAlign: 'center',
    marginBottom: 10,
  },

  coinModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coinModalContent: {
    backgroundColor: Colors.textLight,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: '80%',
    elevation: 10,
  },
  modalCoinImage: { width: 150, height: 150, resizeMode: 'contain', marginBottom: 20 },
  modalMessage: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 28,
  },
  modalButton: { width: '70%' },
});

export default HomeScreen;
