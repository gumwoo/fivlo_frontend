// src/screens/PomodoroBreakChoiceScreen.jsx

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// 공통 스타일 및 컴포넌트 임포트
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import { useTranslation } from 'react-i18next';
import useFocusStore from '../../store/focusStore';

const PomodoroBreakChoiceScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { addRecord } = useFocusStore();

  const { selectedGoal, focusedTime = 0 } = route.params;

  // selectedGoal이 객체인 경우 text 속성 추출
  const goalText = selectedGoal?.text || selectedGoal || t('pomodoro.study_mode');

  // 화면 진입 시 기록 저장
  useEffect(() => {
    const saveRecord = async () => {
      if (focusedTime > 0) {
        await addRecord({
          goal: goalText,
          focusedTime,
          type: 'pomodoro', // 포모도로 기록
        });

        if (__DEV__) {
          console.log('[PomodoroBreakChoice] Saved focus record:', {
            goal: goalText,
            time: `${Math.floor(focusedTime / 60)}m ${focusedTime % 60}s`,
          });
        }
      }
    };

    saveRecord();
  }, []);

  // 시간 포맷 함수 (초 → 분초)
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return { minutes, seconds };
  };

  const { minutes, seconds } = formatTime(focusedTime);

  const handleAnalysis = () => {
    // 집중도 분석 화면으로 이동 (월간 탭)
    navigation.navigate('AnalysisGraphScreen');
  };

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top }]}>
      <Header title={t('pomodoro.header')} showBackButton={true} />

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* 상단 타이틀 - 선택한 목표 표시 */}
        <Text style={styles.titleText}>
          {goalText}
        </Text>

        {/* GIF 애니메이션 캐릭터 */}
        <Image
          source={require('../../../assets/pomodoro.gif')}
          style={styles.pomodoroGif}
        />

        {/* 집중 완료 메시지 */}
        <Text style={styles.completeText}>
          {t('pomodoro.focus_complete', { minutes, seconds })}
        </Text>
        <Text style={styles.praiseText}>
          {t('pomodoro.praise_message')}
        </Text>

        {/* 집중도 분석 버튼 */}
        <Button
          title={t('pomodoro.view_analysis')}
          onPress={handleAnalysis}
          style={styles.analysisButton}
        />
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
    paddingVertical: 30,
  },
  titleText: {
    fontSize: FontSizes.extraLarge,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 30,
    textAlign: 'center',
  },
  pomodoroGif: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  completeText: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 10,
    textAlign: 'center',
  },
  praiseText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    marginBottom: 40,
    textAlign: 'center',
  },
  analysisButton: {
    width: '90%',
    backgroundColor: Colors.accentApricot,
  },
});

export default PomodoroBreakChoiceScreen;
