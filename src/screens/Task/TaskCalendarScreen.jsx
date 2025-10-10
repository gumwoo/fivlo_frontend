// src/screens/Task/TaskCalendarScreen.jsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import Header from '../../components/common/Header';
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import useTaskStore from '../../store/taskStore';


// ── 캘린더 한국어 설정
LocaleConfig.locales['ko'] = {
  monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
  monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
  dayNames: ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'],
  dayNamesShort: ['일','월','화','수','목','금','토'],
  today: '오늘',
};
LocaleConfig.defaultLocale = 'ko';

const TaskCalendarScreen = () => {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  // 전역 스토어에서 tasks와 updateTask 함수 가져오기
  const tasks = useTaskStore((state) => state.tasks);
  const updateTask = useTaskStore((state) => state.updateTask);

  // 날짜 탭 시 상세 모달 화면으로 이동
  const handleDayPress = (dateString) => {
    setSelectedDate(dateString);
    const tasksForDate = tasks[dateString] || [];
    navigation.navigate('TaskDetailModal', {
      selectedDate: dateString,
      tasks: tasksForDate,
      onTaskUpdate: (taskId, updates) => updateTask(dateString, taskId, updates),
    });
  };

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top }]}>
      <Header title={t('task.title', 'TASK')} showBackButton />

      <View style={styles.calendarWrapper}>
        <Calendar
          current={selectedDate}
          enableSwipeMonths
          hideExtraDays
          dayComponent={({ date }) => {
            const ds = date?.dateString;
            const items = tasks[ds] || [];
            return (
              <TouchableOpacity
                style={styles.dayCell}
                onPress={() => ds && handleDayPress(ds)}
                activeOpacity={0.85}
              >
                <Text style={styles.dayNumber}>{date?.day}</Text>
                {!!items.length && (
                  <View style={styles.tagsRow} pointerEvents="none">
                    {items.map((it) => (
                      <View
                        key={it.id}
                        style={[styles.tagChip, { backgroundColor: it.color }]}
                      >
                        <Text numberOfLines={1} style={styles.tagText}>
                          {it.text}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </TouchableOpacity>
            );
          }}
          theme={{
            backgroundColor: Colors.primaryBeige,
            calendarBackground: Colors.primaryBeige,
            textSectionTitleColor: Colors.textDark,
            dayTextColor: Colors.textDark,
            todayTextColor: Colors.accentApricot,
            arrowColor: Colors.secondaryBrown,
            monthTextColor: Colors.textDark,
            textMonthFontWeight: FontWeights.bold,
            textMonthFontSize: 20,
            textDayFontSize: 16,
            textDayHeaderFontWeight: FontWeights.bold,
          }}
          style={styles.calendar}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: Colors.primaryBeige },
  calendarWrapper: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 15,
  },
  calendar: {
    width: '100%',
  },
  dayCell: {
    alignItems: 'center',
    paddingVertical: 10,
    minHeight: 100,
  },
  dayNumber: {
    fontSize: 19,
    color: Colors.textDark,
    marginBottom: 6,
    fontWeight: FontWeights.bold,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    rowGap: 4,
  },
  tagChip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginHorizontal: 2,
  },
  tagText: {
    fontSize: 10,
    color: '#222',
    maxWidth: 68,
  },
});

export default TaskCalendarScreen;
