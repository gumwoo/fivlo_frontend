// src/screens/Analysis/MonthlyAnalysisView.jsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { format, startOfMonth, eachDayOfInterval, endOfMonth, isSameDay } from 'date-fns';
import { ko } from 'date-fns/locale';

// 공통 스타일 및 컴포넌트 임포트
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';

// 캘린더 한국어 설정 (TaskCalendarScreen과 동일)
LocaleConfig.locales['ko'] = {
  monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘',
};
LocaleConfig.defaultLocale = 'ko';

const MonthlyAnalysisView = ({ date }) => {
  // 임시 데이터 (실제로는 백엔드에서 해당 월의 집중 기록 가져옴)
  const mockMonthlyData = {
    '2025-07': { // 해당 월 (yyyy-MM)
      totalConcentrationTime: 3500, // 월간 누적 (분)
      averageConcentrationTime: 113, // 월간 평균 (분)
      concentrationRatio: 72, // %
      focusTime: 3500,
      breakTime: 1500,
      dailyConcentration: { // 일별 집중 시간 (분)
        '2025-07-01': { minutes: 120, activities: [{ name: '독서', color: '#A0FFC3' }] },
        '2025-07-05': { minutes: 180, activities: [{ name: '공부', color: '#99DDFF' }] },
        '2025-07-10': { minutes: 60, activities: [{ name: '운동', color: '#FFABAB' }] },
        '2025-07-15': { minutes: 240, activities: [{ name: '개발', color: '#FFC3A0' }] },
        '2025-07-20': { minutes: 150, activities: [{ name: '토익', color: '#FFD1DC' }] },
        '2025-07-25': { minutes: 90, activities: [{ name: '일상', color: Colors.primaryBeige }] },
      },
      monthlyActivities: [ // 월간 집중 분야 분석
        { name: '공부', totalTime: 1500, color: '#99DDFF' },
        { name: '운동', totalTime: 800, color: '#FFABAB' },
        { name: '개발', totalTime: 700, color: '#FFC3A0' },
        { name: '독서', totalTime: 500, color: '#A0FFC3' },
      ],
    },
    '2025-06': { // 이전 월 예시
      totalConcentrationTime: 2800,
      averageConcentrationTime: 93,
      concentrationRatio: 68,
      focusTime: 2800,
      breakTime: 1300,
      dailyConcentration: {},
      monthlyActivities: [],
    }
  };

  const [monthlyData, setMonthlyData] = useState(null);
  const [selectedDayActivities, setSelectedDayActivities] = useState(null); // 막대 그래프 클릭 시 활동 표시

  useEffect(() => {
    const monthString = format(date, 'yyyy-MM');
    setMonthlyData(mockMonthlyData[monthString] || {
      totalConcentrationTime: 0,
      averageConcentrationTime: 0,
      concentrationRatio: 0,
      focusTime: 0,
      breakTime: 0,
      dailyConcentration: {},
      monthlyActivities: [],
    });
  }, [date]);

  // 월간 바 차트 데이터 (13번)
  const getMonthlyBarChartData = () => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    const daysInMonth = eachDayOfInterval({ start, end });

    return daysInMonth.map(day => {
      const dayString = format(day, 'yyyy-MM-dd');
      const minutes = monthlyData?.dailyConcentration[dayString]?.minutes || 0;
      const activities = monthlyData?.dailyConcentration[dayString]?.activities || [];
      return { date: day, minutes, activities };
    });
  };

  const renderBarChartColumn = ({ item }) => {
    const heightPercentage = (item.minutes / 300) * 100; // 300분(5시간) 기준
    const barColor = item.activities.length > 0 ? item.activities[0].color : Colors.secondaryBrown; // 첫 활동 색상 또는 기본

    return (
      <TouchableOpacity
        style={styles.barColumn}
        onPress={() => setSelectedDayActivities(item.activities)} // 막대 그래프 클릭 시 활동 표시
      >
        <View style={[styles.bar, { height: `${heightPercentage}%`, backgroundColor: barColor }]} />
        <Text style={styles.barLabel}>{format(item.date, 'dd')}</Text>
      </TouchableOpacity>
    );
  };

  // 월간 달력 UI (16번)
  const getMarkedDatesForCalendar = () => {
    const marked = {};
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    const daysInMonth = eachDayOfInterval({ start, end });

    daysInMonth.forEach(day => {
      const dayString = format(day, 'yyyy-MM-dd');
      const minutes = monthlyData?.dailyConcentration[dayString]?.minutes || 0;
      let backgroundColor = Colors.textLight; // 기본 흰색

      if (minutes > 0) {
        if (minutes < 60) { // 0 ~ 1시간
          backgroundColor = '#F5E6CC'; // 밝은 갈색 (primaryBeige보다 밝게)
        } else if (minutes >= 60 && minutes < 120) { // 1 ~ 2시간
          backgroundColor = '#D4B88C'; // 중간 갈색
        } else { // 2시간 이상
          backgroundColor = '#A87C6F'; // 짙은 갈색 (secondaryBrown)
        }
      }

      marked[dayString] = {
        customStyles: {
          container: {
            backgroundColor: backgroundColor,
            borderRadius: 5,
          },
          text: {
            color: minutes > 0 ? Colors.textLight : Colors.textDark, // 집중량에 따라 텍스트 색상 변경
          },
        },
      };
    });
    return marked;
  };

  return (
    <View style={styles.container}>
      {/* 월간 집중 분야 분석 (12번) */}
      <Text style={styles.sectionTitle}>월간 집중 분야 분석</Text>
      <View style={styles.monthlyActivitiesContainer}>
        {monthlyData?.monthlyActivities.length > 0 ? (
          monthlyData.monthlyActivities.map((activity, index) => (
            <View key={index} style={styles.activityItem}>
              <View style={[styles.activityColorIndicator, { backgroundColor: activity.color }]} />
              <Text style={styles.activityName}>{activity.name}</Text>
              <Text style={styles.activityTime}>{activity.totalTime}분</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>월간 집중 분야 기록이 없습니다.</Text>
        )}
      </View>

      {/* 월간 바 차트 (13번) */}
      <Text style={styles.sectionTitle}>일별 집중 시간 추이</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.barChartScrollView}>
        <View style={styles.barChartContainer}>
          {getMonthlyBarChartData().map((data, index) => (
            <TouchableOpacity
              key={index}
              style={styles.barColumn}
              onPress={() => setSelectedDayActivities(data.activities)} // 막대 그래프 클릭 시 활동 표시
            >
              <View style={[
                styles.bar,
                {
                  height: `${(data.minutes / 300) * 100}%`, // 300분(5시간) 기준
                  backgroundColor: data.activities.length > 0 ? data.activities[0].color : Colors.secondaryBrown,
                }
              ]} />
              <Text style={styles.barLabel}>{format(data.date, 'dd')}</Text>
            </TouchableOpacity>
          ))}
          {/* 기준선 표시 (Y축 눈금) */}
          <View style={styles.yAxisLabels}>
            <Text style={styles.yAxisLabel}>300분</Text>
            <Text style={styles.yAxisLabel}>240분</Text>
            <Text style={styles.yAxisLabel}>180분</Text>
            <Text style={styles.yAxisLabel}>120분</Text>
            <Text style={styles.yAxisLabel}>60분</Text>
            <Text style={styles.yAxisLabel}>0분</Text>
          </View>
        </View>
      </ScrollView>
      {selectedDayActivities && selectedDayActivities.length > 0 && (
        <View style={styles.selectedDayActivitiesContainer}>
          <Text style={styles.selectedDayActivitiesTitle}>선택된 날짜 활동</Text>
          {selectedDayActivities.map((activity, index) => (
            <Text key={index} style={styles.selectedDayActivityText}>
              - {activity.name} ({activity.time}분)
            </Text>
          ))}
        </View>
      )}

      {/* 월간 달력 UI (16번) */}
      <Text style={styles.sectionTitle}>월간 집중량 달력</Text>
      <Calendar
        markingType={'custom'}
        markedDates={getMarkedDatesForCalendar()}
        theme={{
          backgroundColor: Colors.primaryBeige,
          calendarBackground: Colors.primaryBeige,
          textSectionTitleColor: Colors.secondaryBrown,
          selectedDayBackgroundColor: Colors.accentApricot, // 이 부분은 customStyles로 덮어씌워짐
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

      {/* 월간 집중도 통계 (14번) */}
      <Text style={styles.sectionTitle}>월간 집중도 통계</Text>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>총 집중 시간</Text>
          <Text style={styles.statValue}>{monthlyData?.totalConcentrationTime || 0}분</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>평균 집중 시간</Text>
          <Text style={styles.statValue}>{monthlyData?.averageConcentrationTime || 0}분</Text>
        </View>
      </View>

      {/* 집중 비율 (15번) */}
      <Text style={styles.sectionTitle}>집중 비율</Text>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>집중 시간과 휴식 시간 비율</Text>
          <Text style={styles.statValue}>{monthlyData?.concentrationRatio || 0}%</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>집중 시간</Text>
          <Text style={styles.statValue}>{monthlyData?.focusTime || 0}분</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>휴식 시간</Text>
          <Text style={styles.statValue}>{monthlyData?.breakTime || 0}분</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 0,
  },
  sectionTitle: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginTop: 25,
    marginBottom: 15,
    width: '100%',
    textAlign: 'left',
    paddingLeft: 20,
  },
  // 월간 집중 분야 분석 스타일
  monthlyActivitiesContainer: {
    width: '100%',
    paddingHorizontal: 20,
    backgroundColor: Colors.textLight,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  activityColorIndicator: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    marginRight: 10,
    borderWidth: 1,
    borderColor: Colors.secondaryBrown,
  },
  activityName: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    flex: 1,
  },
  activityTime: {
    fontSize: FontSizes.medium,
    color: Colors.secondaryBrown,
    fontWeight: FontWeights.bold,
  },
  noDataText: {
    fontSize: FontSizes.medium,
    color: Colors.secondaryBrown,
    textAlign: 'center',
    marginTop: 10,
  },
  // 월간 바 차트 스타일
  barChartScrollView: {
    width: '100%',
    height: 250, // 차트 높이 고정
    paddingHorizontal: 10,
  },
  barChartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: '100%',
    paddingBottom: 10,
    paddingHorizontal: 5,
    position: 'relative', // Y축 라벨을 위해
  },
  barColumn: {
    width: 20, // 각 바의 너비
    marginHorizontal: 2,
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: '100%',
    borderRadius: 3,
  },
  barLabel: {
    fontSize: FontSizes.small - 2,
    color: Colors.secondaryBrown,
    marginTop: 5,
  },
  yAxisLabels: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingRight: 5,
    alignItems: 'flex-end',
  },
  yAxisLabel: {
    fontSize: FontSizes.small - 2,
    color: Colors.secondaryBrown,
  },
  selectedDayActivitiesContainer: {
    width: '100%',
    paddingHorizontal: 20,
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
  selectedDayActivitiesTitle: {
    fontSize: FontSizes.medium,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 10,
  },
  selectedDayActivityText: {
    fontSize: FontSizes.small,
    color: Colors.textDark,
    marginBottom: 5,
  },
  // 월간 달력 스타일
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
  // 통계 스타일 (DailyAnalysisView와 유사)
  statsContainer: {
    width: '100%',
    paddingHorizontal: 20,
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
});

export default MonthlyAnalysisView;
