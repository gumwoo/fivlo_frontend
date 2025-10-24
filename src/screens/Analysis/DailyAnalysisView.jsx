// src/screens/Analysis/DailyAnalysisView.jsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import { format, startOfWeek, addDays } from 'date-fns';
// 공통 스타일 및 컴포넌트 임포트
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import useFocusStore from '../../store/focusStore';
import DonutChart from '../../components/common/DonutChart';
import { formatTime } from '../../utils/timeFormat';

const DailyAnalysisView = ({ date }) => {
  const { getRecordsByDate } = useFocusStore();
  const [dailyData, setDailyData] = useState(null);

  useEffect(() => {
    // date prop이 변경될 때마다 해당 날짜의 데이터 로드
    const dateString = format(date, 'yyyy-MM-dd');
    const records = getRecordsByDate(dateString);

    if (__DEV__) {
      console.log('[DailyAnalysisView] Date:', dateString, 'Records:', records.length);
    }

    // 활동별로 그룹화하고 총 시간 계산
    const activitiesMap = {};
    let totalTime = 0;
    
    records.forEach((record) => {
      const goal = record.goal || '기타';
      const time = record.focusedTime || 0; // 초 단위
      
      if (!activitiesMap[goal]) {
        activitiesMap[goal] = {
          id: goal,
          name: goal,
          time: 0, // 분 단위로 저장
          color: getColorForGoal(goal),
        };
      }
      
      // ✅ 초를 분으로 변환하여 저장
      activitiesMap[goal].time += Math.floor(time / 60);
      totalTime += time;
    });

    const activities = Object.values(activitiesMap);
    const totalMinutes = Math.floor(totalTime / 60);

    setDailyData({
      totalConcentrationTime: totalMinutes,
      concentrationRatio: totalMinutes > 0 ? Math.min(100, Math.floor((totalMinutes / 1440) * 100)) : 0,
      activities,
      hourlyData: {}, // TODO: 시간대별 데이터 구현
    });
  }, [date]);

  // 목표별 색상 지정
  const getColorForGoal = (goal) => {
    const colors = {
      '공부하기': '#FFD1DC',
      '운동하기': '#FFABAB',
      '독서하기': '#A0FFC3',
      '정리하기': '#FFE5B4',
      '기타': Colors.lightGray,
    };
    return colors[goal] || Colors.lightGray;
  };
  
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

      {/* 집중도 통계 (5번) - 사진과 동일하게 */}
      <View style={styles.statsContainerWithChart}>
        {/* 왼쪽: 총 집중 시간 */}
        <View style={styles.statTextSection}>
          <Text style={styles.statLabelSmall}>총 집중 시간</Text>
          <Text style={styles.statValueLarge}>{formatTime(dailyData?.totalConcentrationTime || 0)}</Text>
        </View>
        
        {/* 구분선 */}
        <View style={styles.divider} />
        
        {/* 오른쪽: 원형 차트 + 집중 비율 */}
        <View style={styles.chartSection}>
          <DonutChart 
            percentage={dailyData?.concentrationRatio || 0} 
            size={80}
            strokeWidth={8}
            color={Colors.secondaryBrown}
          />
          <Text style={styles.statLabelSmall}>집중 비율</Text>
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
  statLabelSmall: {
    fontSize: FontSizes.small,
    color: Colors.secondaryBrown,
    marginBottom: 5,
  },
  statValueLarge: {
    fontSize: FontSizes.extraLarge,
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
