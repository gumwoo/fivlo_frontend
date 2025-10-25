// src/screens/Analysis/DDayAnalysisView.jsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Pressable, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format, differenceInDays, isSameDay, startOfMonth, eachDayOfInterval, endOfMonth, isValid } from 'date-fns';
import { ko } from 'date-fns/locale';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

// 공통 스타일 및 컴포넌트 임포트
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Button from '../../components/common/Button';
import ObooniCalendar from '../../components/common/ObooniCalendar';
import { formatTime } from '../../utils/timeFormat';

// 목표 설정 모달 컴포넌트
const GoalSettingModal = ({ visible, onClose, onSelectGoal, t }) => {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customGoal, setCustomGoal] = useState('');
  const presetGoals = [
    t('pomodoro_goals.study'),
    t('pomodoro_goals.exercise'),
    t('pomodoro_goals.reading'),
    t('analysis.dday.coding'),
    t('analysis.dday.training')
  ];

  const handleCustomGoalSubmit = () => {
    if (customGoal.trim()) {
      onSelectGoal(customGoal.trim());
      setCustomGoal('');
      setShowCustomInput(false);
    } else {
      Alert.alert(t('common.error'), t('analysis.dday.alert_message'));
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{t('pomodoro.what_focus')}</Text>
          <ScrollView>
            {presetGoals.map((goal, index) => (
              <TouchableOpacity key={index} style={styles.modalItem} onPress={() => onSelectGoal(goal)}>
                <Text style={styles.modalItemText}>{goal}</Text>
              </TouchableOpacity>
            ))}
            
            {/* 직접 입력 버튼 */}
            <TouchableOpacity 
              style={styles.modalItem} 
              onPress={() => setShowCustomInput(true)}
            >
              <Text style={styles.modalItemText}>{t('pomodoro.create_goal')}</Text>
            </TouchableOpacity>
            
            {/* 직접 입력 폼 */}
            {showCustomInput && (
              <View style={styles.customInputContainer}>
                <TextInput
                  style={styles.customInput}
                  placeholder={t('analysis.dday.goal_phrase_placeholder')}
                  value={customGoal}
                  onChangeText={setCustomGoal}
                  autoFocus
                />
                <View style={styles.customInputButtons}>
                  <TouchableOpacity 
                    style={[styles.customInputButton, styles.cancelButton]} 
                    onPress={() => {
                      setShowCustomInput(false);
                      setCustomGoal('');
                    }}
                  >
                    <Text style={styles.buttonText}>{t('common.cancel')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.customInputButton, styles.confirmButton]} 
                    onPress={handleCustomGoalSubmit}
                  >
                    <Text style={styles.buttonText}>{t('common.ok')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>
          <Button title={t('obooni.close')} onPress={onClose} style={{ marginTop: 10 }} />
        </View>
      </Pressable>
    </Modal>
  );
};

const DDayAnalysisView = ({ isPremiumUser }) => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [isLocked, setIsLocked] = useState(!isPremiumUser);

  // 초기 목표 문구를 비워두어 placeholder가 보이도록 수정
  const mockDDayGoal = {
    phrase: '', // 초기값 비움
    date: null, // 초기값 null
    totalConcentrationTime: 1250,
    currentAchievementRate: 75,
    dailyConcentration: {
      '2025-08-01': { minutes: 30 },
      '2025-08-05': { minutes: 90 },
      '2025-08-10': { minutes: 150 },
      '2025-08-15': { minutes: 60 },
      '2025-07-21': { minutes: 180 },
      '2025-07-20': { minutes: 100 },
      '2025-07-19': { minutes: 75 },
    }
  };

  const [dDayGoal, setDDayGoal] = useState(mockDDayGoal);
  const [goalDate, setGoalDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isGoalModalVisible, setGoalModalVisible] = useState(false);

  useEffect(() => {
    const parsedDate = new Date(dDayGoal.date);
    if (isValid(parsedDate)) {
      setGoalDate(parsedDate);
    }
  }, [dDayGoal.date]);

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setGoalDate(selectedDate);
      setDDayGoal(prev => ({ ...prev, date: format(selectedDate, 'yyyy-MM-dd') }));
    }
  };

  const handleSetGoalPhrase = () => {
    setGoalModalVisible(true);
  };

  const handleSelectGoal = (goal) => {
    setDDayGoal(prev => ({ ...prev, phrase: goal }));
    setGoalModalVisible(false);
  };

  const handleStartPomodoro = () => {
    if (!dDayGoal.phrase || !dDayGoal.date) {
      Alert.alert(t('reminder.location_required_title'), t('analysis.dday.alert_message'));
      return;
    }
    // 포모도로 목표 선택 화면으로 이동 (새로운 목표 자동 생성)
    navigation.navigate('PomodoroGoalCreation', { 
      ddayGoal: dDayGoal.phrase,
      createNewGoal: true 
    });
  };
  
  if (isLocked) {
    return (
      <View style={styles.lockedContainer}>
        <FontAwesome5 name="lock" size={80} color={Colors.secondaryBrown} />
        <Text style={styles.lockedText}>{t('premium.preparing_message')}</Text>
        <Button
          title={t('premium.one_month')}
          onPress={() => Alert.alert(t('premium.title'), t('premium.preparing_message'))}
          style={styles.purchaseButton}
        />
      </View>
    );
  }

  const isStartButtonEnabled = dDayGoal.phrase && dDayGoal.date;

  return (
    <View style={styles.container}>
      <GoalSettingModal
        visible={isGoalModalVisible}
        onClose={() => setGoalModalVisible(false)}
        onSelectGoal={handleSelectGoal}
        t={t}
      />
      <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
        <Text style={styles.sectionTitle}>{t('analysis.dday.goal_phrase_title')}</Text>
        <TouchableOpacity style={styles.goalPhraseButton} onPress={handleSetGoalPhrase}>
          <Text style={dDayGoal.phrase ? styles.goalPhraseText : styles.placeholderText}>
            {dDayGoal.phrase || t('analysis.dday.goal_phrase_placeholder')}
          </Text>
          <FontAwesome5 name="edit" size={18} color={Colors.secondaryBrown} />
        </TouchableOpacity>
      
        <Text style={styles.sectionTitle}>{t('analysis.dday.goal_period_title')}</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
          <Text style={dDayGoal.date ? styles.datePickerButtonText : styles.placeholderText}>
            {dDayGoal.date ? format(goalDate, 'yyyy년 MM월 dd일', { locale: ko }) : t('analysis.dday.goal_period_placeholder')}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={goalDate}
            mode="date"
            display="spinner"
            onChange={onChangeDate}
            minimumDate={new Date()}
          />
        )}
      
        <Button 
            title={t('analysis.dday.start_button')} 
            onPress={handleStartPomodoro} 
            style={[styles.startButton, !isStartButtonEnabled && styles.disabledButton]}
            disabled={!isStartButtonEnabled}
        />
      
        {isStartButtonEnabled && (
          <>
            <Text style={styles.sectionTitle}>{t('analysis.dday.focus_goal')}</Text>
            <View style={styles.goalDisplayContainer}>
              <Text style={styles.goalDisplayText}>{dDayGoal.phrase}</Text>
              <Text style={styles.dDayText}>
                D-{differenceInDays(new Date(dDayGoal.date), new Date())}
              </Text>
            </View>
      
            <Text style={styles.sectionTitle}>{t('analysis.dday.focus_summary')}</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>{t('analysis.dday.total_focus_time')}</Text>
                <Text style={styles.statValue}>{formatTime(dDayGoal.totalConcentrationTime || 0)}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>{t('analysis.dday.achievement_rate')}</Text>
                <Text style={styles.statValue}>{dDayGoal.currentAchievementRate || 0}%</Text>
              </View>
            </View>
            
            <ObooniCalendar 
              date={goalDate}
              dailyConcentration={dDayGoal.dailyConcentration || {}}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryBeige,
    paddingBottom: 100, // 하단 네비게이션 바 공간 확보
  },
  scrollViewContentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
    paddingTop: 10,
  },
  lockedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primaryBeige,
    paddingHorizontal: 20,
  },
  lockedText: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.secondaryBrown,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  purchaseButton: {
    width: '80%',
  },
  sectionTitle: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginTop: 25,
    marginBottom: 10,
    width: '100%',
    textAlign: 'left',
  },
  goalPhraseButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    backgroundColor: Colors.textLight,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  goalPhraseText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    flex: 1,
  },
  placeholderText: {
    fontSize: FontSizes.medium,
    color: Colors.gray,
    flex: 1,
  },
  datePickerButton: {
    width: '100%',
    backgroundColor: Colors.textLight,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  datePickerButtonText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    fontWeight: FontWeights.regular,
  },
  startButton: {
    width: '100%',
    marginTop: 30,
  },
  disabledButton: {
    backgroundColor: Colors.secondaryBrown,
    elevation: 0,
  },
  goalDisplayContainer: {
    width: '100%',
    backgroundColor: Colors.textLight,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  goalDisplayText: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: 10,
  },
  dDayText: {
    fontSize: FontSizes.medium,
    color: Colors.secondaryBrown,
    fontWeight: FontWeights.bold,
  },
  statsContainer: {
    width: '100%',
    marginTop: 20,
    backgroundColor: Colors.textLight,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statLabel: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    fontWeight: FontWeights.medium,
  },
  statValue: {
    fontSize: FontSizes.medium,
    color: Colors.secondaryBrown,
    fontWeight: FontWeights.bold,
  },
  calendar: {
    width: '100%',
    padding: 10,
    borderRadius: 15,
    backgroundColor: Colors.textLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  // Modal Styles
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: Colors.textLight,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalItemText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
  },
  // 직접 입력 스타일
  customInputContainer: {
    padding: 15,
    backgroundColor: Colors.primaryBeige,
    borderRadius: 10,
    marginTop: 10,
  },
  customInput: {
    backgroundColor: Colors.textLight,
    borderRadius: 8,
    padding: 12,
    fontSize: FontSizes.medium,
    borderWidth: 1,
    borderColor: Colors.secondaryBrown,
    marginBottom: 10,
  },
  customInputButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  customInputButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.lightGray,
  },
  confirmButton: {
    backgroundColor: Colors.secondaryBrown,
  },
  buttonText: {
    color: Colors.textLight,
    fontSize: FontSizes.medium,
    fontWeight: FontWeights.bold,
  },
  });

export default DDayAnalysisView;