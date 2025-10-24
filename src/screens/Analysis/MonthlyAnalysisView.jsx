// src/screens/Analysis/MonthlyAnalysisView.jsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import { format, startOfMonth, eachDayOfInterval, endOfMonth, isSameDay } from 'date-fns';
import { ko } from 'date-fns/locale';

// 공통 스타일 및 컴포넌트 임포트
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import useFocusStore from '../../store/focusStore';
import DonutChart from '../../components/common/DonutChart';
import { formatTime } from '../../utils/timeFormat';
import ObooniCalendar from '../../components/common/ObooniCalendar';

const MonthlyAnalysisView = ({ date }) => {
  const { records } = useFocusStore();
  const [monthlyData, setMonthlyData] = useState(null);
  const [selectedDayActivities, setSelectedDayActivities] = useState(null);

  // 목표별 색상 지정
  const getColorForGoal = (goal) => {
    const colors = {
      '공부하기': '#99DDFF',
      '운동하기': '#FFABAB',
      '독서하기': '#A0FFC3',
      '개발': '#FFC3A0',
      '토익': '#FFD1DC',
      '업무': '#D1B5FF',
      '일상': Colors.primaryBeige,
      '기타': Colors.lightGray,
    };
    return colors[goal] || Colors.lightGray;
  };

  useEffect(() => {
    const monthPrefix = format(date, 'yyyy-MM');
    const monthRecords = records.filter(r => r.date && r.date.startsWith(monthPrefix));
    
    if (__DEV__) {
      console.log('[MonthlyAnalysisView] Month:', monthPrefix, 'Records:', monthRecords.length);
    }

    // 일별 집중 시간 계산
    const dailyConcentration = {};
    const activitiesMap = {};

    monthRecords.forEach(record => {
      const recordDate = record.date;
      const minutes = (record.focusedTime || 0) / 60;
      const goal = record.goal || '기타';

      // 일별 집계
      if (!dailyConcentration[recordDate]) {
        dailyConcentration[recordDate] = {
          minutes: 0,
          activities: [],
        };
      }
      dailyConcentration[recordDate].minutes += minutes;
      dailyConcentration[recordDate].activities.push({
        name: goal,
        color: getColorForGoal(goal),
        time: Math.floor(minutes),
      });

      // 활동별(카테고리별) 집계
      if (!activitiesMap[goal]) {
        activitiesMap[goal] = 0;
      }
      activitiesMap[goal] += minutes;
    });

    // minutes를 정수로 변환
    Object.keys(dailyConcentration).forEach(dateKey => {
      dailyConcentration[dateKey].minutes = Math.floor(dailyConcentration[dateKey].minutes);
    });

    // monthlyActivities 배열 생성 (시간순 정렬)
    const monthlyActivities = Object.entries(activitiesMap)
      .map(([name, totalTime]) => ({
        name,
        totalTime: Math.floor(totalTime),
        color: getColorForGoal(name),
      }))
      .sort((a, b) => b.totalTime - a.totalTime); // 내림차순

    // 총 집중 시간 (분)
    const totalConcentrationTime = monthlyActivities.reduce((sum, a) => sum + a.totalTime, 0);
    
    // 월간 일수 계산
    const daysInMonth = endOfMonth(date).getDate();
    
    // 평균 집중 시간 (분)
    const averageConcentrationTime = Math.floor(totalConcentrationTime / daysInMonth);
    
    // 집중 비율 (총 집중 시간 / 월간 총 시간 * 100)
    const totalMonthMinutes = daysInMonth * 24 * 60;
    const concentrationRatio = totalConcentrationTime > 0 
      ? Math.min(100, Math.floor((totalConcentrationTime / totalMonthMinutes) * 100))
      : 0;

    setMonthlyData({
      totalConcentrationTime,
      averageConcentrationTime,
      concentrationRatio,
      focusTime: totalConcentrationTime,
      breakTime: 0, // TODO: 휴식 시간 계산
      dailyConcentration,
      monthlyActivities,
    });
  }, [date, records]);

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

      {/* 월간 달력 UI (16번) - 오보니 캐릭터 달력 */}
      <ObooniCalendar 
        date={date}
        dailyConcentration={monthlyData?.dailyConcentration || {}}
      />
      <View style={styles.statsContainerWithChart}>
        {/* 왼쪽: 총 집중 시간 + 평균 집중 시간 */}
        <View style={styles.statTextSection}>
          <View style={styles.statRow}>
            <Text style={styles.statLabelSmall}>월간 총 집중 시간</Text>
            <Text style={styles.statValueLarge}>{formatTime(monthlyData?.totalConcentrationTime || 0)}</Text>
          </View>
          <View style={[styles.statRow, { marginTop: 15 }]}>
            <Text style={styles.statLabelSmall}>월간 평균 집중 시간</Text>
            <Text style={styles.statValueLarge}>{formatTime(monthlyData?.averageConcentrationTime || 0)}</Text>
          </View>
        </View>
        
        {/* 구분선 */}
        <View style={styles.divider} />
        
        {/* 오른쪽: 원형 차트 + 집중 비율 */}
        <View style={styles.chartSection}>
          <Text style={styles.statLabelSmall}>월간 집중 비율</Text>
          <DonutChart 
            percentage={monthlyData?.concentrationRatio || 0} 
            size={100}
            strokeWidth={10}
            color={Colors.secondaryBrown}
          />
          <View style={styles.chartLabels}>
            <Text style={styles.chartLabelText}>집중 시간   {formatTime(monthlyData?.focusTime || 0)}</Text>
            <Text style={styles.chartLabelText}>휴식 시간   {formatTime(monthlyData?.breakTime || 0)}</Text>
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

export default MonthlyAnalysisView;
