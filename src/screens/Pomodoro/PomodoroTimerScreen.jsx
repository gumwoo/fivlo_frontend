// src/screens/Pomodoro/PomodoroTimerScreen.jsx

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Header from '../../components/common/Header';

// --- ✨ 1. 타이머 시간 25분, 5분으로 수정 ---
const FOCUS_TIME = 25 * 60; // 25분 (초 단위)
const BREAK_TIME = 5 * 60;  // 5분 (초 단위)

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
    navigation.navigate('PomodoroFinish', { selectedGoal: goal });
  };
  
  const handleCycleEnd = () => {
    setIsRunning(false);
    if (isFocusMode) {
      // 집중 시간 종료 -> 휴식 선택 화면으로
      navigation.navigate('PomodoroBreakChoice', { 
        selectedGoal: goal,
        cycleCount: cycleCount + 1 
      });
    } else {
      // 휴식 시간 종료 -> 사이클 완료 화면으로
      setCycleCount(prev => prev + 1);
      navigation.navigate('PomodoroCycleComplete', {
        selectedGoal: goal,
        cycleCount: cycleCount + 1,
      });
    }
  };

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const remainingMinutes = Math.floor(timeLeft / 60);
  const remainingSeconds = timeLeft % 60;

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top }]}>
      <Header title={t('pomodoro.header')} showBackButton={true} />

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* 목표 텍스트 */}
        <Text style={styles.goalText}>{goal.text}</Text>

        <View style={styles.timerContainer}>
          {/* --- ✨ 2. 타이머 상태에 따라 다른 이미지 표시 --- */}
          {isRunning ? (
             <Image source={require('../../../assets/타임어택 오분이.gif')} style={styles.characterImage} />
          ) : (
             <Image source={require('../../../assets/기본오분이.png')} style={styles.characterImage} />
          )}
          
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
          <Text style={styles.remainingTimeText}>
             {t('pomodoro.timer_remaining', { min: remainingMinutes, sec: remainingSeconds })}
          </Text>
        </View>

        <View style={styles.controlButtons}>
          <TouchableOpacity style={styles.controlButton} onPress={handleStartPause}>
            <FontAwesome5 
              name={isRunning ? "pause" : "play"} 
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

// --- ✨ 3. Figma 디자인에 맞춰 스타일 수정 ---
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.primaryBeige,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 80, // 하단 탭바 높이만큼 여백
  },
  goalText: {
    fontSize: FontSizes.extraLarge,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 40,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  characterImage: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
  },
  timerText: {
    fontSize: FontSizes.extraLarge * 2,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginTop: -40, // 캐릭터 이미지와 겹치도록 위치 조정
  },
  remainingTimeText: {
    fontSize: FontSizes.medium,
    color: Colors.secondaryBrown,
    marginTop: 10,
  },
  controlButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
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