// src/components/common/ObooniCalendar.jsx

import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addDays } from 'date-fns';
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';

/**
 * 오보니 캐릭터가 표시되는 커스텀 월간 달력
 * @param {Date} date - 표시할 월의 날짜
 * @param {Object} dailyConcentration - 일별 집중 시간 데이터 { '2025-10-01': { minutes: 120 } }
 */
const ObooniCalendar = ({ date, dailyConcentration = {} }) => {
  // 오보니 이미지 매핑
  const obooniImages = {
    sad: require('../../../assets/images/obooni_sad.png'),
    default: require('../../../assets/images/obooni_default.png'),
    happy: require('../../../assets/images/obooni_happy.png'),
  };

  // 집중 시간에 따라 오보니 표정 결정
  const getObooniType = (minutes) => {
    if (minutes === 0) return null; // 집중 시간 없음
    if (minutes < 60) return 'sad';      // 0 ~ 1시간: 슬픔
    if (minutes < 120) return 'default';  // 1 ~ 2시간: 기본
    return 'happy';                      // 2시간 이상: 해피
  };

  // 해당 월의 모든 날짜 가져오기
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // 월의 첫 날이 무슨 요일인지 (0: 일요일 ~ 6: 토요일)
  const startDayOfWeek = getDay(monthStart);

  // 빈 칸 추가 (첫 날 이전)
  const emptyDays = Array.from({ length: startDayOfWeek }, (_, i) => null);

  // 전체 날짜 배열 (빈 칸 + 실제 날짜)
  const allDays = [...emptyDays, ...daysInMonth];

  // 요일 헤더
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <View style={styles.container}>
      {/* 월 표시 */}
      <Text style={styles.monthTitle}>{format(date, 'yyyy년 M월')}</Text>

      {/* 요일 헤더 */}
      <View style={styles.weekDaysRow}>
        {weekDays.map((day, index) => (
          <View key={index} style={styles.weekDayCell}>
            <Text style={[
              styles.weekDayText,
              index === 0 && { color: '#FF6B6B' }, // 일요일 빨강
              index === 6 && { color: '#4ECDC4' }, // 토요일 파랑
            ]}>
              {day}
            </Text>
          </View>
        ))}
      </View>

      {/* 날짜 그리드 */}
      <View style={styles.daysGrid}>
        {allDays.map((day, index) => {
          if (!day) {
            // 빈 칸
            return <View key={`empty-${index}`} style={styles.dayCell} />;
          }

          const dayString = format(day, 'yyyy-MM-dd');
          const minutes = dailyConcentration[dayString]?.minutes || 0;
          const obooniType = getObooniType(minutes);

          return (
            <View key={dayString} style={styles.dayCell}>
              {/* 오보니 이미지 */}
              {obooniType && (
                <Image 
                  source={obooniImages[obooniType]} 
                  style={styles.obooniImage}
                  resizeMode="contain"
                />
              )}
              {/* 날짜 숫자 (오보니 없으면 표시) */}
              {!obooniType && (
                <Text style={styles.dayNumber}>{format(day, 'd')}</Text>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  monthTitle: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: 15,
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  weekDayCell: {
    width: '14.28%', // 7일 = 100% / 7
    alignItems: 'center',
  },
  weekDayText: {
    fontSize: FontSizes.small,
    fontWeight: FontWeights.medium,
    color: Colors.secondaryBrown,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%', // 7일 = 100% / 7
    aspectRatio: 1, // 정사각형
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  obooniImage: {
    width: '100%',
    height: '100%',
  },
  dayNumber: {
    fontSize: FontSizes.small,
    color: Colors.textDark,
  },
});

export default ObooniCalendar;
