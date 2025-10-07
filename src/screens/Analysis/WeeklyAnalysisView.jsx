// src/screens/Analysis/WeeklyAnalysisView.jsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import { format, startOfWeek, addDays } from 'date-fns';
import { ko } from 'date-fns/locale';

// 공통 스타일 및 컴포넌트 임포트
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';

const WeeklyAnalysisView = ({ date }) => {
  // 임시 데이터 (실제로는 백엔드에서 해당 주의 집중 기록 가져옴)
  const mockWeeklyData = {
    '2025-07-20': { // 해당 주의 시작일 (일요일 기준)
      totalConcentrationTime: 850, // 주간 누적 (분)
      averageConcentrationTime: 121, // 주간 평균 (분)
      concentrationRatio: 70, // %
      focusTime: 850, // 집중 시간
      breakTime: 360, // 휴식 시간
      dailyConcentration: [ // 요일별 집중 시간 (분)
        { day: '일', minutes: 120, activities: [{ name: '운동', color: '#FFABAB' }] },
        { day: '월', minutes: 90, activities: [{ name: '공부', color: '#99DDFF' }] },
        { day: '화', minutes: 150, activities: [{ name: '개발', color: '#FFC3A0' }] },
        { day: '수', minutes: 80, activities: [{ name: '독서', color: '#A0FFC3' }] },
        { day: '목', minutes: 130, activities: [{ name: '업무', color: '#D1B5FF' }] },
        { day: '금', minutes: 100, activities: [{ name: '회의', color: '#FFFFB5' }] },
        { day: '토', minutes: 180, activities: [{ name: '취미', color: '#FFD1DC' }] },
      ],
      mostConcentratedDay: '토요일',
    },
    '2025-07-13': { // 이전 주 예시
      totalConcentrationTime: 600,
      averageConcentrationTime: 85,
      concentrationRatio: 65,
      focusTime: 600,
      breakTime: 320,
      dailyConcentration: [
        { day: '일', minutes: 80 }, { day: '월', minutes: 70 },
        { day: '화', minutes: 100 }, { day: '수', minutes: 60 },
        { day: '목', minutes: 90 }, { day: '금', minutes: 80 },
        { day: '토', minutes: 120 },
      ],
      mostConcentratedDay: '토요일',
    }
  };

  const [weeklyData, setWeeklyData] = useState(null);

  useEffect(() => {
    // date prop이 변경될 때마다 해당 주의 데이터 로드 (주의 시작일 기준)
    const weekStartDate = format(startOfWeek(date, { weekStartsOn: 0 }), 'yyyy-MM-dd'); // 일요일 시작
    setWeeklyData(mockWeeklyData[weekStartDate] || {
      totalConcentrationTime: 0,
      averageConcentrationTime: 0,
      concentrationRatio: 0,
      focusTime: 0,
      breakTime: 0,
      dailyConcentration: [],
      mostConcentratedDay: '-',
    });
  }, [date]);

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

      {/* 주간 집중도 통계 (9번) */}
      <Text style={styles.sectionTitle}>주간 집중도 통계</Text>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>주간 누적 총 집중 시간</Text>
          <Text style={styles.statValue}>{weeklyData?.totalConcentrationTime || 0}분</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>주간 평균 집중 시간</Text>
          <Text style={styles.statValue}>{weeklyData?.averageConcentrationTime || 0}분</Text>
        </View>
      </View>

      {/* 집중 비율 (10번) */}
      <Text style={styles.sectionTitle}>집중 비율</Text>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>집중 시간과 휴식 시간 비율</Text>
          <Text style={styles.statValue}>{weeklyData?.concentrationRatio || 0}%</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>집중 시간</Text>
          <Text style={styles.statValue}>{weeklyData?.focusTime || 0}분</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>휴식 시간</Text>
          <Text style={styles.statValue}>{weeklyData?.breakTime || 0}분</Text>
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

export default WeeklyAnalysisView;
