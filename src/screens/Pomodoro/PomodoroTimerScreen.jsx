// src/screens/Pomodoro/PomodoroTimerScreen.jsx

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Animated } from 'react-native';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
// SVG 기반 아날로그 시계는 디자인과 다르므로 렌더링하지 않습니다.
// import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';

import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Header from '../../components/common/Header';

const FOCUS_TIME = 25 * 60; // 25분 (초 단위)
const BREAK_TIME = 5 * 60;  // 5분 (초 단위)

// --- ✨ 새로운 커스텀 시계 컴포넌트 ✨ ---
const AnimatedClock = ({ timeLeft, totalTime, isFocusMode }) => {
  const animatedRotation = useRef(new Animated.Value(0)).current;
  const prevTimeLeft = useRef(timeLeft);

  useEffect(() => {
    // timeLeft가 변경될 때마다 애니메이션 업데이트
    if (timeLeft >= 0) {
      const remainingRatio = timeLeft / totalTime; // 남은 시간 비율 (0.0 ~ 1.0)
      const rotationDegree = 360 * (1 - remainingRatio); // 회전 각도 (0 ~ 360도)

      Animated.timing(animatedRotation, {
        toValue: rotationDegree,
        duration: 1000, // 1초 동안 부드럽게 전환
        useNativeDriver: true,
      }).start();
    }
    prevTimeLeft.current = timeLeft;
  }, [timeLeft, totalTime]);

  const clockBackgroundColor = isFocusMode ? Colors.accentApricot : Colors.accentYellow; // 집중: 주황, 휴식: 노랑
  const handleColor = isFocusMode ? '#E98C0B' : '#F7B731'; // 바늘 색상
  const borderColor = isFocusMode ? '#CC7B0A' : '#E0A320'; // 테두리 색상
  const centerColor = isFocusMode ? Colors.accentApricot : Colors.accentYellow; // 중심 색상

  return null; // 아날로그 시계 비활성화
};


const PomodoroTimerScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const { t } = useTranslation();

  const { selectedGoal, resume, timeLeft: resumeTimeLeft, isFocusMode: resumeIsFocusMode } = route.params || {};
  const goal = selectedGoal || { text: t('pomodoro.default_goal'), color: Colors.accentApricot };

  const [timeLeft, setTimeLeft] = useState(resumeTimeLeft ?? FOCUS_TIME);
  const [isRunning, setIsRunning] = useState(resume ?? false);
  const [isFocusMode, setIsFocusMode] = useState(resumeIsFocusMode ?? true);
  const [cycleCount, setCycleCount] = useState(0);

  const timerRef = useRef(null);

  // 화면이 다시 활성화될 때 타이머 상태를 초기화하거나 이어감
  useEffect(() => {
    if (isFocused) {
      if (resume) {
        // 다른 화면에서 돌아왔을 때 (예: 휴식 선택 후)
        setTimeLeft(resumeTimeLeft ?? (isFocusMode ? FOCUS_TIME : BREAK_TIME));
        setIsFocusMode(resumeIsFocusMode ?? true);
        setIsRunning(true);
      }
    } else {
      // 다른 화면으로 이동할 때 타이머 일시정지
      setIsRunning(false);
      clearInterval(timerRef.current);
    }
  }, [isFocused, resume, resumeTimeLeft, resumeIsFocusMode]);

  // 타이머 로직
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      clearInterval(timerRef.current);
      handleCycleEnd();
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, timeLeft]);

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleStop = () => {
    setIsRunning(false);
    // 실제 집중한 시간 계산 (초 단위)
    const focusedTime = isFocusMode ? (FOCUS_TIME - timeLeft) : 0;
    
    navigation.navigate('PomodoroResetConfirmModal', {
      onConfirm: () => {
        // 중단 시 화면 13 (집중 완료 화면)으로
        navigation.navigate('PomodoroBreakChoice', { 
          selectedGoal: goal,
          focusedTime: focusedTime, // 실제 집중 시간 전달
        });
      },
      onCancel: () => navigation.goBack(),
    });
  };
  
  const handleCycleEnd = () => {
    setIsRunning(false);
    if (isFocusMode) {
      // 집중 시간 종료 (25분 완료) -> 휴식 선택 모달로
      navigation.navigate('PomodoroBreakOptionModal', {
        onContinue: () => {
          // "네" 선택 시 - 모달 닫고 바로 다음 포모도로 시작
          navigation.goBack(); // 모달 닫기
          setTimeout(() => {
            navigation.navigate('PomodoroTimer', { 
              selectedGoal: goal, 
              resume: true, 
              isFocusMode: true 
            });
          }, 100);
        },
        onBreak: () => {
          // "아니오" 선택 시 - 모달 닫고 휴식 시간 시작
          navigation.goBack(); // 모달 닫기
          setTimeout(() => {
            navigation.navigate('PomodoroTimer', { 
              selectedGoal: goal, 
              isFocusMode: false 
            });
          }, 100);
        },
      });
    } else {
      // 휴식 시간 종료 -> 사이클 완료 화면으로
      setCycleCount(prev => prev + 1);
      navigation.navigate('PomodoroCycleComplete', {
        selectedGoal: goal,
        cycleCount: cycleCount + 1,
        isFocusMode: true, // 다음은 집중 모드
      });
    }
  };

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`; // 디자인의 공백 포함 형식
  };

  const remainingMinutes = Math.floor(timeLeft / 60);
  const remainingSeconds = timeLeft % 60;
  const currentTotalTime = isFocusMode ? FOCUS_TIME : BREAK_TIME;

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top }]}>
      <Header title={t('pomodoro.header')} showBackButton={true} />

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* 상단 타이틀 */}
        <Text style={styles.titleText}>
          {isFocusMode ? (goal?.text || goal || t('pomodoro.study_mode')) : t('pomodoro.break_time')}
        </Text>
      
        {/* GIF 애니메이션 캐릭터 */}
        <Image 
          source={require('../../../assets/포모도로.gif')}
          style={styles.pomodoroGif}
        />
      
        {/* 타이머 시간 표시 */}
        <Text style={styles.timerText}>
          {formatTime(currentTotalTime - timeLeft)}
        </Text>
        
        {/* 남은 시간 텍스트 */}
        <Text style={styles.remainingTimeText}>
          {t('pomodoro.timer_remaining', { min: remainingMinutes, sec: remainingSeconds })}
        </Text>
      
        {/* 컨트롤 버튼 */}
        <View style={styles.controlButtons}>
          <TouchableOpacity style={styles.controlButton} onPress={handleStartPause}>
            <FontAwesome5 
              name={isRunning ? "pause" : "play"} 
              size={32} 
              color={Colors.textDark} 
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton} onPress={handleStop}>
            <FontAwesome5 name="stop" size={32} color={Colors.textDark} />
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
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  titleText: {
    fontSize: FontSizes.extraLarge,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 40,
    textAlign: 'center',
  },
  pomodoroGif: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    marginBottom: 0,
  },
  timerText: {
    fontSize: 60,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 10,
    letterSpacing: 4,
  },
  remainingTimeText: {
    fontSize: FontSizes.large,
    color: Colors.secondaryBrown,
    marginBottom: 30,
  },
  controlButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '70%',
  },
  controlButton: {
    backgroundColor: Colors.textLight,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
});

export default PomodoroTimerScreen;
