// src/screens/TimeAttack/TimeAttackGoalSettingScreen.jsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import { useTranslation } from 'react-i18next';
import TimePicker from '../../components/common/TimePicker'; // 새로 만든 TimePicker 임포트

const TimeAttackGoalSettingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { selectedGoal } = route.params;

  const [time, setTime] = useState({ h: 0, m: 40, s: 0 });

  const totalSeconds = time.h * 3600 + time.m * 60 + time.s;
  const totalMinutes = Math.floor(totalSeconds / 60);

  const formatTimeForDisplay = () => {
    const displayMinutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const displaySeconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${displayMinutes}:${displaySeconds}`;
  };

  const handleStartAttack = () => {
    if (totalSeconds <= 0) {
      Alert.alert(t('common.alert'), t('time_attack.invalid_minutes_message'));
      return;
    }
    Alert.alert(
      t('time_attack.start_title'), 
      t('time_attack.start_message', { goal: selectedGoal, minutes: totalMinutes })
    );
    navigation.navigate('TimeAttackAISubdivisionScreen', { selectedGoal, totalMinutes });
  };

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top }]}>
      <Header title={t('headers.time_attack')} showBackButton={true} />
      <View style={styles.content}>
        <Text style={styles.questionText}>{t('time_attack.question_time')}</Text>
        <View style={styles.timerDisplayContainer}>
          <Text style={styles.timerText}>{formatTimeForDisplay()}</Text>
          <Text style={styles.minuteText}>{t('time_attack.minute_label')}</Text>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <TimePicker time={time} setTime={setTime} />
        <Button
          title={t('common.start')}
          onPress={handleStartAttack}
          style={styles.startButton}
          textStyle={styles.startButtonText}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: Colors.primaryBeige },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  questionText: { fontSize: FontSizes.large, color: Colors.textDark, fontWeight: 'bold', marginBottom: 20 },
  timerDisplayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: Colors.lightGray,
    borderRadius: 15,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)'
  },
  timerText: { fontSize: 48, fontWeight: 'bold', color: Colors.textDark },
  minuteText: { fontSize: 32, fontWeight: 'bold', color: Colors.textDark, marginLeft: 10, marginTop: 5 },
  bottomContainer: {
    paddingBottom: 20,
    backgroundColor: Colors.primaryBeige
  },
  startButton: {
    backgroundColor: '#FFD700', // 노란색
    borderRadius: 0,
    paddingVertical: 20,
    marginHorizontal: -20, // 화면 꽉차게
  },
  startButtonText: { color: Colors.textDark, fontSize: FontSizes.large, fontWeight: 'bold' },
});

export default TimeAttackGoalSettingScreen;