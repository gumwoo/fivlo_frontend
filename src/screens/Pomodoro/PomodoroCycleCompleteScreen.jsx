// src/screens/PomodoroCycleCompleteScreen.jsx

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native'; // ScrollView 임포트 추가!
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

const PomodoroCycleCompleteScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const { selectedGoal, cycleCount } = route.params;
  const [countdown, setCountdown] = useState(3);
  const timerRef = useRef(null);

  useEffect(() => {
    // 3초 후 자동으로 계속 진행
    timerRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timerRef.current);
          handleContinue();
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleContinue = () => {
    navigation.navigate('PomodoroTimer', { selectedGoal, resume: true, isFocusMode: true });
  };

  const handleStop = () => {
    navigation.navigate('PomodoroFinish', { selectedGoal });
  };

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top }]}>
      <Header title={t('pomodoro.header')} showBackButton={true} />

      <ScrollView contentContainerStyle={styles.contentContainer}> {/* ScrollView로 감싸기 */}
        <Text style={styles.cycleCompleteText}>{t('pomodoro.cycle_complete', { count: cycleCount })}</Text>
        
        <CharacterImage style={styles.obooniCharacter} />
        
        <View style={styles.buttonContainer}>
          <Button title={t('pomodoro.continue')} onPress={handleContinue} style={styles.actionButton} />
          <Button title={t('pomodoro.stop')} onPress={handleStop} primary={false} style={styles.actionButton} />
        </View>
        <Text style={styles.autoProceedText}>{countdown}초가 지나면 "{t('pomodoro.continue')}" 로 진행합니다.</Text>
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
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  cycleCompleteText: {
    fontSize: FontSizes.extraLarge,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 30,
    textAlign: 'center',
  },
  obooniCharacter: {
    width: 250,
    height: 250,
    marginBottom: 50,
  },
  buttonContainer: {
    width: '80%',
    alignItems: 'center',
  },
  actionButton: {
    marginBottom: 15,
  },
  autoProceedText: {
    marginTop: 6,
    color: Colors.secondaryBrown,
  },
});

export default PomodoroCycleCompleteScreen;
