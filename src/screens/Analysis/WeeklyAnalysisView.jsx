// src/screens/Analysis/WeeklyAnalysisView.jsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import { format, startOfWeek, addDays } from 'date-fns';
import { ko } from 'date-fns/locale';

// 공통 스타일 및 컴포넌트 임포트
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import useFocusStore from '../../store/focusStore';
import DonutChart from '../../components/common/DonutChart';
import { formatTime } from '../../utils/timeFormat';
const WeeklyAnalysisView = ({ date }) => {
  const { getRecordsByDateRange } = useFocusStore();
  const [weeklyData, setWeeklyData] = useState(null);

  // 목표별 색상 지정
  const getColorForGoal = (goal) => {
    const colors = {
      '공부하기': '#99DDFF',
      '운동하기': '#FFABAB',
      '독서하기': '#A0FFC3',
      '개발': '#FFC3A0',
      '업무': '#D1B5FF',
      '회의': '#FFFFB5',
      '취미': '#FFD1DC',
      '기타': Colors.lightGray,
    };
    return colors[goal] || Colors.lightGray;
  };

  useEffect(() => {
    // date prop이 변경될 때마다 해당 주의 데이터 로드
    const weekStart = startOfWeek(date, { weekStartsOn: 0 }); // 일요일 시작
    const weekEnd = addDays(weekStart, 6);
    
    const weekStartDate = format(weekStart, 'yyyy-MM-dd');
    const weekEndDate = format(weekEnd, 'yyyy-MM-dd');
    
    const records = getRecordsByDateRange(weekStartDate, weekEndDate);
    
    if (__DEV__) {
      console.log('[WeeklyAnalysisView] Week:', weekStartDate, '-', weekEndDate, 'Records:', records.length);
    }

    // 요일별 집중 시간 계산 (7일)
    const dailyConcentration = Array.from({ length: 7 }, (_, i) => {
      const day = addDays(weekStart, i);
      const dayString = format(day, 'yyyy-MM-dd');
      const dayRecords = records.filter(r => r.date === dayString);
      
      const totalMinutes = dayRecords.reduce((sum, r) => sum + (r.focusedTime || 0) / 60, 0);
      
      return {
        day: format(day, 'EEEEEE', { locale: ko }), // 요일 이름 (일, 월, 화, ...)
        minutes: Math.floor(totalMinutes),
        activities: dayRecords.map(r => ({
          name: r.goal || '기타',
          color: getColorForGoal(r.goal || '기타'),
        })),
      };
    });

    // 총 집중 시간 (분)
    const totalConcentrationTime = dailyConcentration.reduce((sum, d) => sum + d.minutes, 0);
    
    // 평균 집중 시간 (분)
    const averageConcentrationTime = Math.floor(totalConcentrationTime / 7);
    
    // 가장 집중한 요일
    const maxDay = dailyConcentration.reduce((max, d) => 
      d.minutes > max.minutes ? d : max
    , { day: '-', minutes: 0 });
    const mostConcentratedDay = maxDay.day + '요일';
    
    // 집중 비율 (총 집중 시간 / 주간 총 시간 * 100)
    const totalWeekMinutes = 7 * 24 * 60; // 주간 총 분
    const concentrationRatio = totalConcentrationTime > 0 
      ? Math.min(100, Math.floor((totalConcentrationTime / totalWeekMinutes) * 100))
      : 0;

    setWeeklyData({
      totalConcentrationTime,
      averageConcentrationTime,
      concentrationRatio,
      focusTime: totalConcentrationTime, // 집중 시간 = 총 집중 시간
      breakTime: 0, // TODO: 휴식 시간 계산 구현 필요
      dailyConcentration,
      mostConcentratedDay,
    });
  }, [date, getRecordsByDateRange]);

  const daysOfWeekShort = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <View style={styles.container}>
      {/* 가장 집중한 요일 (7번) */}
      <Text style={styles.sectionTitle}>가장 집중한 요일</Text>
      <View style={styles.mostConcentratedDayContainer}>
        <Text style={styles.mostConcentratedDayText}>{weeklyData?.mostConcentratedDay}</Text>
      </View>

      {/* 요일별 바 차트 (8번) */}
      <Text style={styles.sectionTitle}>요일별 집중도</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.barChartScrollView}>
        <View style={styles.barChartContainer}>
          {weeklyData?.dailyConcentration.map((data, index) => (
            <View key={index} style={styles.barColumn}>
              <View style={[
                styles.bar,
                { height: `${(data.minutes / 240) * 100}%` } // 240분(4시간) 기준
              ]} />
              <Text style={styles.barLabel}>{data.day}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* 주간 집중도 통계 (9번) - 사진과 동일하게 */}
      <View style={styles.statsContainerWithChart}>
        {/* 왼쪽: 총 집중 시간 + 평균 집중 시간 */}
        <View style={styles.statTextSection}>
          <View style={styles.statRow}>
            <Text style={styles.statLabelSmall}>총 집중 시간</Text>
            <Text style={styles.statValueLarge}>{formatTime(weeklyData?.totalConcentrationTime || 0)}</Text>
          </View>
          <View style={[styles.statRow, { marginTop: 15 }]}>
            <Text style={styles.statLabelSmall}>평균 집중 시간</Text>
            <Text style={styles.statValueLarge}>{formatTime(weeklyData?.averageConcentrationTime || 0)}</Text>
          </View>
        </View>
        
        {/* 구분선 */}
        <View style={styles.divider} />
        
        {/* 오른쪽: 원형 차트 + 집중 비율 */}
        <View style={styles.chartSection}>
          <Text style={styles.statLabelSmall}>집중 비율</Text>
          <DonutChart 
            percentage={weeklyData?.concentrationRatio || 0} 
            size={100}
            strokeWidth={10}
            color={Colors.secondaryBrown}
          />
          <View style={styles.chartLabels}>
            <Text style={styles.chartLabelText}>집중 시간   {formatTime(weeklyData?.focusTime || 0)}</Text>
            <Text style={styles.chartLabelText}>휴식 시간   {formatTime(weeklyData?.breakTime || 0)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 0,
    paddingBottom: 100, // 하단 네비게이션 바 공간 확보
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
  mostConcentratedDayContainer: {
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
    alignItems: 'center',
  },
  mostConcentratedDayText: {
    fontSize: FontSizes.extraLarge,
    fontWeight: FontWeights.bold,
    color: Colors.accentApricot,
  },
  // 바 차트 스타일 (DailyAnalysisView와 유사)
  barChartScrollView: {
    width: '100%',
    height: 200,
    paddingHorizontal: 10,
  },
  barChartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: '100%',
    paddingBottom: 10,
    paddingHorizontal: 5,
  },
  barColumn: {
    width: 35, // 요일별 바 너비
    marginHorizontal: 5,
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: '100%',
    backgroundColor: Colors.secondaryBrown, // 기본 바 색상
    borderRadius: 3,
  },
  barLabel: {
    fontSize: FontSizes.small,
    color: Colors.secondaryBrown,
    marginTop: 5,
  },
  // 통계 스타일 - 사진과 동일한 레이아웃
  statsContainerWithChart: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 30,
    marginBottom: 20,
    flexDirection: 'row',
    backgroundColor: Colors.textLight,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statTextSection: {
    flex: 1,
    justifyContent: 'center',
  },
  statRow: {
    marginBottom: 5,
  },
  statLabelSmall: {
    fontSize: FontSizes.small,
    color: Colors.secondaryBrown,
    marginBottom: 5,
  },
  statValueLarge: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
  },
  divider: {
    width: 1,
    height: '80%',
    backgroundColor: Colors.secondaryBrown,
    marginHorizontal: 15,
  },
  chartSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartLabels: {
    marginTop: 10,
  },
  chartLabelText: {
    fontSize: FontSizes.small,
    color: Colors.textDark,
    marginVertical: 2,
  },
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

export default WeeklyAnalysisView;
