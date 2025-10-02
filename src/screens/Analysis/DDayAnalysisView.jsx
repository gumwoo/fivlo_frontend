// src/screens/Analysis/DDayAnalysisView.jsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Pressable, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format, differenceInDays, isSameDay, startOfMonth, eachDayOfInterval, endOfMonth, isValid } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { FontAwesome5 } from '@expo/vector-icons';

// 공통 스타일 및 컴포넌트 임포트
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Button from '../../components/common/Button';

// 캘린더 한국어 설정
LocaleConfig.locales['ko'] = {
  monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘',
};
LocaleConfig.defaultLocale = 'ko';

// 목표 설정 모달 컴포넌트
const GoalSettingModal = ({ visible, onClose, onSelectGoal }) => {
  const presetGoals = ['공부하기', '운동하기', '독서하기', '코딩하기', '국비 교육 공부하기', '목표 작성하기'];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>무엇에 집중하고 싶으신가요?</Text>
          <ScrollView>
            {presetGoals.map((goal, index) => (
              <TouchableOpacity key={index} style={styles.modalItem} onPress={() => onSelectGoal(goal)}>
                <Text style={styles.modalItemText}>{goal}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Button title="닫기" onPress={onClose} style={{ marginTop: 10 }} />
        </View>
      </Pressable>
    </Modal>
  );
};

const DDayAnalysisView = ({ isPremiumUser }) => {
  const navigation = useNavigation();
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
      Alert.alert('알림', '목표 문구와 목표 기간을 모두 설정해주세요.');
      return;
    }
    navigation.navigate('PomodoroTimerScreen', { goal: dDayGoal });
  };

  const getMarkedDatesForCalendar = () => {
    const marked = {};
    const baseDateForCalendar = isValid(new Date(dDayGoal.date)) ? new Date(dDayGoal.date) : new Date();

    const start = startOfMonth(baseDateForCalendar);
    const end = endOfMonth(baseDateForCalendar);

    if (!isValid(start) || !isValid(end)) {
        return {};
    }

    const daysInMonth = eachDayOfInterval({ start, end });

    daysInMonth.forEach(day => {
      if (!isValid(day)) {
        return;
      }

      const dayString = format(day, 'yyyy-MM-dd');
      const minutes = dDayGoal.dailyConcentration[dayString]?.minutes || 0;
      let obooniImageSource = null;

      if (minutes > 0) {
        if (minutes < 60) {
          obooniImageSource = require('../../../assets/images/obooni_sad.png');
        } else if (minutes >= 60 && minutes < 120) {
          obooniImageSource = require('../../../assets/images/obooni_default.png');
        } else {
          obooniImageSource = require('../../../assets/images/obooni_happy.png');
        }
      }

      if (obooniImageSource) {
        marked[dayString] = {
          customStyles: {
            container: {
              backgroundColor: minutes > 120 ? Colors.accentApricot : (minutes > 60 ? Colors.secondaryBrown : Colors.primaryBeige),
              borderRadius: 5,
            },
            text: {
              color: minutes > 0 ? Colors.textLight : Colors.textDark,
            },
          },
          dots: [{ key: `obooni-${dayString}`, color: obooniImageSource ? Colors.accentApricot : 'transparent', selectedDotColor: 'transparent' }],
        };
      }
    });
    return marked;
  };

  if (isLocked) {
    return (
      <View style={styles.lockedContainer}>
        <FontAwesome5 name="lock" size={80} color={Colors.secondaryBrown} />
        <Text style={styles.lockedText}>이 기능은 유료 버전에서만 이용 가능합니다.</Text>
        <Button
          title="유료 버전 구매하기"
          onPress={() => Alert.alert('결제 유도', '유료 버전 구매 페이지로 이동합니다.')}
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
      />
      
      <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
        <Text style={styles.sectionTitle}>목표 문구 설정</Text>
        <TouchableOpacity style={styles.goalPhraseButton} onPress={handleSetGoalPhrase}>
          <Text style={dDayGoal.phrase ? styles.goalPhraseText : styles.placeholderText}>
            {dDayGoal.phrase || '달성하고자 하는 목표를 입력하세요'}
          </Text>
          <FontAwesome5 name="edit" size={18} color={Colors.secondaryBrown} />
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>목표 기간 설정</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
          <Text style={dDayGoal.date ? styles.datePickerButtonText : styles.placeholderText}>
            {dDayGoal.date ? format(goalDate, 'yyyy년 MM월 dd일', { locale: ko }) : '목표 날짜를 선택하세요'}
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
            title="시작하기" 
            onPress={handleStartPomodoro} 
            style={[styles.startButton, !isStartButtonEnabled && styles.disabledButton]}
            disabled={!isStartButtonEnabled}
        />

        {isStartButtonEnabled && (
          <>
            <Text style={styles.sectionTitle}>집중 목표</Text>
            <View style={styles.goalDisplayContainer}>
              <Text style={styles.goalDisplayText}>{dDayGoal.phrase}</Text>
              <Text style={styles.dDayText}>
                D-{differenceInDays(new Date(dDayGoal.date), new Date())}
              </Text>
            </View>

            <Text style={styles.sectionTitle}>집중 요약</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>총 집중 시간</Text>
                <Text style={styles.statValue}>{dDayGoal.totalConcentrationTime || 0}분</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>현재까지 목표 달성율</Text>
                <Text style={styles.statValue}>{dDayGoal.currentAchievementRate || 0}%</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>캘린더 달성일</Text>
            <Calendar
              markingType={'custom'}
              markedDates={getMarkedDatesForCalendar()}
              theme={{
                backgroundColor: Colors.primaryBeige,
                calendarBackground: Colors.primaryBeige,
                textSectionTitleColor: Colors.secondaryBrown,
                selectedDayBackgroundColor: Colors.accentApricot,
                selectedDayTextColor: Colors.textLight,
                todayTextColor: Colors.accentApricot,
                dayTextColor: Colors.textDark,
                textDisabledColor: '#d9e1e8',
                dotColor: Colors.accentApricot,
                selectedDotColor: Colors.textLight,
                arrowColor: Colors.secondaryBrown,
                monthTextColor: Colors.textDark,
                textMonthFontWeight: FontWeights.bold,
                textMonthFontSize: FontSizes.large,
                textDayHeaderFontWeight: FontWeights.medium,
                textDayFontSize: FontSizes.medium,
                textDayFontWeight: FontWeights.regular,
              }}
              style={styles.calendar}
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
    backgroundColor: Colors.gray,
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
});

export default DDayAnalysisView;