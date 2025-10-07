// src/screens/Analysis/DailyAnalysisView.jsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import { format, startOfWeek, addDays } from 'date-fns';
// 공통 스타일 및 컴포넌트 임포트
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';

const DailyAnalysisView = ({ date }) => {
  // 임시 데이터 (실제로는 백엔드에서 해당 날짜의 집중 기록 가져옴)
  const mockDailyData = {
    '2025-07-20': {
      totalConcentrationTime: 150, // 분 단위
      concentrationRatio: 75, // %
      activities: [
        { id: 'a1', name: '토익공부', time: 60, color: '#FFD1DC' },
        { id: 'a2', name: 'FIVLO 개발', time: 45, color: '#99DDFF' },
        { id: 'a3', name: '독서', time: 30, color: '#A0FFC3' },
      ],
      hourlyData: { // 시간대별 데이터 (0시~23시)
        '09': { '토익공부': 30 },
        '10': { '토익공부': 30, 'FIVLO 개발': 15 },
        '14': { 'FIVLO 개발': 30 },
        '19': { '독서': 30 },
      }
    },
    '2025-07-21': { // 다른 날짜 예시
      totalConcentrationTime: 90,
      concentrationRatio: 60,
      activities: [
        { id: 'a4', name: '운동', time: 45, color: '#FFABAB' },
        { id: 'a5', name: '일상 정리', time: 45, color: Colors.primaryBeige },
      ],
      hourlyData: {
        '08': { '운동': 45 },
        '17': { '일상 정리': 45 },
      }
    }
  };

  const [dailyData, setDailyData] = useState(null);

  useEffect(() => {
    // date prop이 변경될 때마다 해당 날짜의 데이터 로드
    const dateString = format(date, 'yyyy-MM-dd');
    setDailyData(mockDailyData[dateString] || {
      totalConcentrationTime: 0,
      concentrationRatio: 0,
      activities: [],
      hourlyData: {}
    });
  }, [date]);

  // 시간대별 바 차트 데이터 생성 (3번)
  const hourlyChartData = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    const activitiesInHour = dailyData?.hourlyData[hour] || {};
    const totalMinutesInHour = Object.values(activitiesInHour).reduce((sum, min) => sum + min, 0);
    return { hour, totalMinutes: totalMinutesInHour, activities: activitiesInHour };
  });

  const renderActivityItem = ({ item }) => (
    <View style={styles.activityItem}>
      <View style={[styles.activityColorIndicator, { backgroundColor: item.color }]} />
      <Text style={styles.activityName}>{item.name}</Text>
      <Text style={styles.activityTime}>{item.time}분</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 시간대별 바 차트 (3번) */}
      <Text style={styles.sectionTitle}>시간대별 집중 활동</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.barChartScrollView}>
        <View style={styles.barChartContainer}>
          {hourlyChartData.map((data, index) => (
            <View key={index} style={styles.barColumn}>
              {/* 활동별 색상으로 구분된 바 차트 표시 */}
              {Object.keys(data.activities).length > 0 ? (
                Object.keys(data.activities).map((activityName, idx) => {
                  const activity = dailyData.activities.find(act => act.name === activityName);
                  const heightPercentage = (data.activities[activityName] / 60) * 100; // 1시간 기준
                  return (
                    <View
                      key={`${index}-${idx}`}
                      style={[
                        styles.barSegment,
                        {
                          height: `${heightPercentage}%`,
                          backgroundColor: activity ? activity.color : Colors.secondaryBrown,
                        },
                      ]}
                    />
                  );
                })
              ) : (
                <View style={styles.emptyBarSegment} />
              )}
              <Text style={styles.barLabel}>{data.hour}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* 집중 기록 (4번) */}
      <Text style={styles.sectionTitle}>집중 기록</Text>
      {dailyData?.activities.length > 0 ? (
        <FlatList
          data={dailyData.activities}
          renderItem={renderActivityItem}
          keyExtractor={item => item.id}
          scrollEnabled={false} // 부모 ScrollView가 스크롤 담당
          contentContainerStyle={styles.activityListContent}
        />
      ) : (
        <Text style={styles.noDataText}>해당 날짜에 집중 기록이 없습니다.</Text>
      )}

      {/* 집중도 통계 (5번) */}
      <Text style={styles.sectionTitle}>집중도 통계</Text>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>총 집중 시간</Text>
          <Text style={styles.statValue}>{dailyData?.totalConcentrationTime || 0}분</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>집중 비율</Text>
          <Text style={styles.statValue}>{dailyData?.concentrationRatio || 0}%</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 0, // AnalysisGraphScreen에서 이미 패딩 적용
  },
  sectionTitle: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginTop: 25,
    marginBottom: 15,
    width: '100%',
    textAlign: 'left',
    paddingLeft: 20, // 화면 좌우 패딩
  },
  // 바 차트 스타일
  barChartScrollView: {
    width: '100%',
    height: 200, // 차트 높이 고정
    paddingHorizontal: 10,
  },
  barChartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end', // 바가 아래부터 쌓이도록
    height: '100%',
    paddingBottom: 10,
    paddingHorizontal: 5,
  },
  barColumn: {
    width: 25, // 각 바의 너비
    marginHorizontal: 5,
    height: '100%',
    justifyContent: 'flex-end', // 바 세그먼트가 아래부터 쌓이도록
    alignItems: 'center',
  },
  barSegment: {
    width: '100%',
    // height는 동적으로 설정
    borderRadius: 3,
  },
  emptyBarSegment: {
    width: '100%',
    height: '10%', // 데이터 없을 때 최소 높이
    backgroundColor: Colors.primaryBeige,
    borderRadius: 3,
  },
  barLabel: {
    fontSize: FontSizes.small,
    color: Colors.secondaryBrown,
    marginTop: 5,
  },
  // 활동 기록 리스트 스타일
  activityListContent: {
    width: '100%',
    paddingHorizontal: 20,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.textLight,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
    fontWeight: FontWeights.medium,
  },
  noDataText: {
    fontSize: FontSizes.medium,
    color: Colors.secondaryBrown,
    textAlign: 'center',
    marginTop: 30,
    paddingHorizontal: 20,
  },
  // 통계 스타일
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

export default DailyAnalysisView;
