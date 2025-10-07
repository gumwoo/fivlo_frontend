// src/screens/Pomodoro/PomodoroTimerScreen.jsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
// --- 수정: Animated, Easing, Image 임포트 정리 ---
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

// 공통 스타일 및 컴포넌트 임포트
import { GlobalStyles } from '../../styles/GlobalStyles';
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Header from '../../components/common/Header';

const FOCUS_TIME = 1* 60; // 25분 (초 단위)
const BREAK_TIME = 1 * 60; // 5분 (초 단위)

const PomodoroTimerScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const defaultGoal = { text: t('pomodoro.default_goal'), color: Colors.accentApricot };
  const selectedGoal = route.params?.selectedGoal || defaultGoal;

  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [isStarted, setIsStarted] = useState(false); // 타이머가 시작되었는지 여부
  const [isFocusMode, setIsFocusMode] = useState(true);
  const [cycleCount, setCycleCount] = useState(0);

  const timerRef = useRef(null);
  // --- 수정: 회전 애니메이션 관련 코드 제거 ---
  // const rotationAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(timerRef.current);
      handleCycleEnd();
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, timeLeft]);

  // --- 수정: 회전 애니메이션 useEffect 제거 ---


  const handleStop = () => {
    // 타이머 정지하고 완료 페이지로 이동
    setIsRunning(false);
    setIsStarted(false);
    navigation.navigate('PomodoroFinish', { selectedGoal });
  };

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleStartPause = () => {
    if (!isStarted) {
      // 처음 시작
      setIsStarted(true);
      setIsRunning(true);
    } else {
      // 일시정지/재시작
      setIsRunning(!isRunning);
    }
  };

  const handleCycleEnd = () => {
    if (isFocusMode) {
      setIsRunning(false);
      navigation.navigate('PomodoroBreakChoice', { selectedGoal });
    } else {
      setIsRunning(false);
      setCycleCount(prev => prev + 1);
      navigation.navigate('PomodoroCycleComplete', { selectedGoal, cycleCount: cycleCount + 1 });
    }
  };

  const remainingMinutes = Math.floor(timeLeft / 60);
  const remainingSeconds = timeLeft % 60;

  // --- 수정: 회전 애니메이션 interpolate 제거 ---

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top }]}>
      {/* 커스텀 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={20} color={Colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>포모도로 기능</Text>
        <TouchableOpacity>
          <FontAwesome5 name="arrow-right" size={20} color={Colors.textDark} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* 선택된 목표 버튼 */}
        <TouchableOpacity style={[styles.selectedGoalButton, { backgroundColor: selectedGoal.color }]}>
          <Text style={styles.selectedGoalText}>{selectedGoal.text}</Text>
        </TouchableOpacity>

        <View style={[styles.timerCircle, { borderColor: selectedGoal.color }]}>
          {/* --- 수정: 기존 시계 이미지와 침 대신 GIF 이미지로 교체 --- */}
          {/* assets 폴더에 '포모도로.gif' 파일이 있는지 확인해주세요. */}
          <Image
            source={require('../../../assets/포모도로.gif')}
            style={styles.pomodoroGif}
          />
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
          <Text style={styles.remainingTimeText}>
             {t('pomodoro.timer_remaining', { min: remainingMinutes, sec: remainingSeconds })}
          </Text>
        </View>

        <View style={styles.controlButtons}>
          <TouchableOpacity style={styles.controlButton} onPress={handleStartPause}>
            <FontAwesome5 
              name={!isStarted ? "play" : (isRunning ? "pause" : "play")} 
              size={24} 
              color={Colors.textDark} 
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton} onPress={handleStop}>
            <FontAwesome5 name="stop" size={24} color={Colors.textDark} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.primaryBeige,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.textLight,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 10,
  },
  headerTitle: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  selectedGoalButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedGoalText: {
    fontSize: FontSizes.medium,
    fontWeight: FontWeights.medium,
    color: Colors.textLight,
  },
  timerCircle: {
    width: 300,
    height: 300,
    borderRadius: 150,
    borderWidth: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
    backgroundColor: Colors.textLight, // GIF 배경이 투명할 경우를 대비한 배경색
    overflow: 'hidden', // GIF가 원 밖으로 나가지 않도록
  },
  // --- 추가: GIF 스타일 ---
  pomodoroGif: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  timerText: {
    fontSize: FontSizes.extraLarge * 1.5,
    fontWeight: FontWeights.bold,
    color: Colors.textDark, // 텍스트가 잘 보이도록 색상 유지
    // zIndex: 1, // GIF 위에 텍스트가 오도록 보장 (필요 시)
  },
  remainingTimeText: {
    position: 'absolute',
    bottom: '25%',
    fontSize: FontSizes.medium,
    color: Colors.secondaryBrown,
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // GIF 위에 텍스트가 더 잘 보이도록 반투명 배경 추가
    paddingHorizontal: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  controlButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
    marginTop: 20,
  },
  controlButton: {
    backgroundColor: Colors.textLight,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default PomodoroTimerScreen;