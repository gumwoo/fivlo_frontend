// src/screens/PomodoroPauseScreen.jsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native'; // ScrollView 임포트 추가!
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// 공통 스타일 및 컴포넌트 임포트
import { GlobalStyles } from '../../styles/GlobalStyles';
import { Colors } from '../../styles/color'; // <-- 사용자님 파일명에 맞춰 'color'로 수정!
import { FontSizes, FontWeights } from '../../styles/Fonts'; // <-- 사용자님 파일명에 맞춰 'Fonts'로 수정!
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import CharacterImage from '../../components/common/CharacterImage';
import { useTranslation } from 'react-i18next';

const PomodoroPauseScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const { selectedGoal, timeLeft, isFocusMode, cycleCount } = route.params;

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleResume = () => {
    navigation.navigate('PomodoroTimer', {
      selectedGoal,
      timeLeft,
      isFocusMode,
      cycleCount,
      resume: true,
    });
  };

  const handleReset = () => {
    navigation.navigate('PomodoroResetConfirmModal', {
      onConfirm: () => {
        navigation.popToTop();
        navigation.navigate('Pomodoro');
      },
      onCancel: () => {
        navigation.goBack();
      }
    });
  };

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top }]}>
      <Header title={t('pomodoro.header')} showBackButton={true} />

      <ScrollView contentContainerStyle={styles.contentContainer}> {/* ScrollView로 감싸기 */}
        <Text style={styles.goalText}>{selectedGoal.text}</Text>
        
        <CharacterImage style={styles.obooniCharacter} />
        <Text style={styles.pausedTimeText}>
          {formatTime(timeLeft)}
        </Text>
        <Text style={styles.remainingTimeText}>
          {t('pomodoro.timer_remaining', { min: Math.floor(timeLeft / 60).toString().padStart(2, '0'), sec: (timeLeft % 60).toString().padStart(2, '0') })}
        </Text>

        <View style={styles.buttonContainer}>
          <Button title={t('pomodoro.pause_resume')} onPress={handleResume} style={styles.actionButton} />
          <Button title={t('pomodoro.pause_reset')} onPress={handleReset} primary={false} style={styles.actionButton} />
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
  contentContainer: { // ScrollView의 contentContainerStyle로 사용
    flexGrow: 1, // ScrollView 내부 콘텐츠가 화면을 채우도록
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  goalText: {
    fontSize: FontSizes.extraLarge,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 30,
    textAlign: 'center',
  },
  obooniCharacter: {
    width: 250,
    height: 250,
    marginBottom: 30,
  },
  pausedTimeText: {
    fontSize: FontSizes.extraLarge * 1.5,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 10,
  },
  remainingTimeText: {
    fontSize: FontSizes.medium,
    color: Colors.secondaryBrown,
    marginBottom: 50,
  },
  buttonContainer: {
    width: '80%',
    alignItems: 'center',
  },
  actionButton: {
    marginBottom: 15,
  },
});

export default PomodoroPauseScreen;
