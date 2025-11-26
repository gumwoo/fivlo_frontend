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

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* 상단 타이틀 */}
        <Text style={styles.titleText}>공부하기</Text>

        {/* GIF 애니메이션 */}
        <Image
          source={require('../../../assets/pomodoro.gif')}
          style={styles.pomodoroGif}
        />

        {/* 사이클 완료 메시지 */}
        <Text style={styles.cycleCompleteText}>
          {cycleCount} 사이클 완료!
        </Text>

        <Text style={styles.questionText}>
          {cycleCount} 사이클 더 하실래요?
        </Text>

        {/* 버튼들 */}
        <View style={styles.buttonContainer}>
          <Button
            title="계속하기"
            onPress={handleContinue}
            style={styles.continueButton}
          />
          <Button
            title="그만하기"
            onPress={handleStop}
            primary={false}
            style={styles.stopButton}
          />
        </View>

        <Text style={styles.autoProceedText}>
          3초가 지나면 '계속하기' 로 진행합니다.
        </Text>
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
    marginBottom: 30,
    textAlign: 'center',
  },
  pomodoroGif: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  cycleCompleteText: {
    fontSize: FontSizes.extraLarge,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 15,
    textAlign: 'center',
  },
  questionText: {
    fontSize: FontSizes.large,
    color: Colors.textDark,
    marginBottom: 40,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  continueButton: {
    flex: 1,
    marginRight: 10,
    backgroundColor: Colors.accentYellow,
  },
  stopButton: {
    flex: 1,
    marginLeft: 10,
  },
  autoProceedText: {
    fontSize: FontSizes.small,
    color: Colors.secondaryBrown,
    textAlign: 'center',
  },
});

export default PomodoroCycleCompleteScreen;