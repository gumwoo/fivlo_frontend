// src/screens/Pomodoro/PomodoroTimerScreen.jsx

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Animated } from 'react-native';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg'; // SVG 컴포넌트 임포트

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

  return (
    <View style={styles.clockContainer}>
      <Svg height="250" width="250" viewBox="0 0 100 100">
        {/* 시계 테두리 */}
        <Circle cx="50" cy="50" r="48" fill={Colors.textLight} stroke={borderColor} strokeWidth="2" />
        {/* 시계 내부 배경 */}
        <Circle cx="50" cy="50" r="45" fill={clockBackgroundColor} />

        {/* 시계 숫자 (대략적인 위치) */}
        {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num, index) => {
          const angle = (index * 30 * Math.PI) / 180; // 각도를 라디안으로 변환
          const x = 50 + 38 * Math.sin(angle);
          const y = 50 - 38 * Math.cos(angle);
          return (
            <SvgText
              key={num}
              x={x}
              y={y + 2} // 텍스트 중앙 정렬을 위해 y 살짝 조정
              fontSize="8"
              fontWeight="bold"
              fill={Colors.textDark}
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              {num}
            </SvgText>
          );
        })}

        {/* 시침 (현재 시간을 기준으로 회전) */}
        <Line
          x1="50" y1="50"
          x2="50" y2="35" // 초기 위치
          stroke={handleColor}
          strokeWidth="3"
          strokeLinecap="round"
          originX="50"
          originY="50"
          rotation={animatedRotation} // 애니메이션 적용
        />
        {/* 분침 (시침보다 길게, 빠르게 움직임 - 여기서는 간단히 하나의 바늘로 시간 비율만 표현) */}
        <Line
          x1="50" y1="50"
          x2="50" y2="30" // 초기 위치
          stroke={handleColor}
          strokeWidth="2"
          strokeLinecap="round"
          originX="50"
          originY="50"
          rotation={animatedRotation} // 애니메이션 적용
        />
        {/* 시계 중심 */}
        <Circle cx="50" cy="50" r="3" fill={centerColor} />
      </Svg>
    </View>
  );
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
    navigation.navigate('PomodoroFinish', { selectedGoal: goal });
  };
  
  const handleCycleEnd = () => {
    setIsRunning(false);
    if (isFocusMode) {
      // 집중 시간 종료 -> 휴식 선택 화면으로
      navigation.navigate('PomodoroBreakChoice', { 
        selectedGoal: goal,
        cycleCount: cycleCount + 1,
        isFocusMode: false, // 다음은 휴식 모드
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
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const remainingMinutes = Math.floor(timeLeft / 60);
  const remainingSeconds = timeLeft % 60;
  const currentTotalTime = isFocusMode ? FOCUS_TIME : BREAK_TIME;

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top }]}>
      <Header title={t('pomodoro.header')} showBackButton={true} />

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* 목표 텍스트 */}
        <Text style={styles.goalText}>{goal.text}</Text>

        <View style={styles.timerWrapper}>
          {/* --- ✨ 커스텀 애니메이션 시계 컴포넌트 사용 ✨ --- */}
          <AnimatedClock 
            timeLeft={timeLeft} 
            totalTime={currentTotalTime} 
            isFocusMode={isFocusMode} 
          />
          {/* 오분이 캐릭터 이미지 (시계 뒤에) */}
          <Image 
            source={require('../../../assets/기본오분이.png')} // 정적인 오분이 이미지
            style={styles.characterBehindClock} 
          />
          
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
  timerWrapper: {
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
    position: 'relative', // 자식 요소 위치 지정을 위해
  },
  characterBehindClock: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    zIndex: 0, // 시계보다 뒤에 위치
  },
  // --- ✨ 커스텀 시계 컴포넌트 스타일 ✨ ---
  clockContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // 오분이 캐릭터보다 앞에 위치
  },
  timerText: {
    position: 'absolute',
    fontSize: FontSizes.extraLarge * 1.5, // 폰트 크기 조정
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    zIndex: 2, // 시계 및 캐릭터보다 위에 위치
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