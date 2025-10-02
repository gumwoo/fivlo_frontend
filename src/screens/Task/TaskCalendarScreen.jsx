// src/screens/TaskCalendarScreen.jsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Calendar, LocaleConfig } from 'react-native-calendars'; // 캘린더 라이브러리
import { format, isSameDay } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';

// 공통 스타일 및 컴포넌트 임포트
import { GlobalStyles } from '../../styles/GlobalStyles';
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Header from '../../components/common/Header';

// TaskDetailModal 임포트 (아직 생성 안 했지만 미리 선언)
import TaskDetailModal from './TaskDetailModal';

// react-native-calendars 설치 필요: npm install react-native-calendars

// 캘린더 한국어 설정
LocaleConfig.locales['ko'] = {
  monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘',
};
LocaleConfig.defaultLocale = 'ko';

const TaskCalendarScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tasksForSelectedDate, setTasksForSelectedDate] = useState([]); // 선택된 날짜의 Task 목록

  // 임시 Task 데이터 (실제로는 백엔드에서 가져옴)
  const mockTasks = {
    '2025-07-20': [ // 오늘 날짜 예시
      { id: 't1', text: t('task_calendar.sample_tasks.water'), completed: false, category: t('task_calendar.categories.daily'), color: Colors.primaryBeige, isDailyRepeat: true, isAlbumLinked: false },
      { id: 't2', text: t('task_calendar.sample_tasks.morning_exercise'), completed: false, category: t('task_calendar.categories.exercise'), color: '#FFABAB', isDailyRepeat: false, isAlbumLinked: true },
      { id: 't3', text: t('task_calendar.sample_tasks.app_dev'), completed: false, category: t('task_calendar.categories.study'), color: '#99DDFF', isDailyRepeat: false, isAlbumLinked: false },
    ],
    '2025-07-21': [
      { id: 't4', text: t('task_calendar.sample_tasks.lunch'), completed: true, category: t('task_calendar.categories.daily'), color: Colors.primaryBeige, isDailyRepeat: true, isAlbumLinked: false },
      { id: 't5', text: t('task_calendar.sample_tasks.dinner'), completed: false, category: t('task_calendar.categories.daily'), color: Colors.primaryBeige, isDailyRepeat: true, isAlbumLinked: false },
    ],
    '2025-07-25': [
      { id: 't6', text: t('task_calendar.sample_tasks.report'), completed: false, category: t('task_calendar.categories.work'), color: '#C3A0FF', isDailyRepeat: false, isAlbumLinked: false },
      { id: 't7', text: t('task_calendar.sample_tasks.meeting_prep'), completed: false, category: t('task_calendar.categories.work'), color: '#C3A0FF', isDailyRepeat: false, isAlbumLinked: false },
    ],
  };

  // 날짜 선택 시 Task 로드 및 모달 열기
  const onDayPress = (day) => {
    const dateString = day.dateString;
    setSelectedDate(dateString);
    setTasksForSelectedDate(mockTasks[dateString] || []);
    setIsModalVisible(true);
  };

  // 캘린더에 Task 색상 표시를 위한 markedDates 생성
  const markedDates = Object.keys(mockTasks).reduce((acc, dateString) => {
    const tasks = mockTasks[dateString];
    if (tasks && tasks.length > 0) {
      acc[dateString] = {
        dots: tasks.map(task => ({
          key: task.id,
          color: task.color,
          selectedDotColor: Colors.textLight, // 선택된 날짜의 점 색상
        })),
        selected: isSameDay(new Date(dateString), new Date(selectedDate)),
        selectedColor: Colors.accentApricot, // 선택된 날짜 배경색
      };
    }
    return acc;
  }, {});

  // 선택된 날짜에도 selected 스타일 적용
  if (selectedDate) {
    markedDates[selectedDate] = {
      ...(markedDates[selectedDate] || {}), // 기존 점들 유지
      selected: true,
      selectedColor: Colors.accentApricot,
      // selectedTextColor: Colors.textLight, // 선택된 날짜 텍스트 색상
    };
  }

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top + 20 }]}>
      <Header title={t('task.title')} showBackButton={true} />

      <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
        <Calendar
          onDayPress={onDayPress}
          markedDates={markedDates}
          markingType={'dots'} // 점으로 표시
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
      </ScrollView>

      {/* Task 상세/입력 모달 */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TaskDetailModal
          selectedDate={selectedDate}
          tasks={tasksForSelectedDate}
          onClose={() => setIsModalVisible(false)}
          // onTaskUpdated, onTaskDeleted 등 콜백 함수 전달 (추후 구현)
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.primaryBeige,
  },
  scrollViewContentContainer: {
    paddingHorizontal: 10,
    paddingBottom: 40,
    alignItems: 'center',
    paddingTop: 10,
  },
  calendar: {
    width: '100%',
    aspectRatio: 1, // 캘린더 비율 유지
    padding: 10,
    borderRadius: 15,
    backgroundColor: Colors.textLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default TaskCalendarScreen;
