// src/screens/TimeAttackCompleteScreen.jsx

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image , Modal} from 'react-native';
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

const TimeAttackCompleteScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const { selectedGoal } = route.params;

  // 컴포넌트 마운트 시 음성 알림
  useEffect(() => {
    // Speech.speak('완료 준비 완료! 오분이가 칭찬합니다', { language: 'ko-KR' }); // 실제 음성 알림 활성화 시 주석 해제
  }, []);

  const handleGoToHome = () => {
    navigation.popToTop(); // 스택의 맨 위로 이동
    navigation.navigate('Main', { screen: 'HomeTab' }); // 홈 탭으로 이동
  };

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top }]}>
      <Header title={t('headers.time_attack')} showBackButton={true} />

      <View style={styles.contentContainer}>
        <Text style={styles.completeText}>{t('time_attack_complete.complete_ready')}</Text>
        <Text style={styles.praiseText}>{t('time_attack_complete.praise_message')}</Text>
        
        <CharacterImage style={styles.obooniCharacter} />
        
        <Button title={t('time_attack_complete.go_home')} onPress={handleGoToHome} style={styles.homeButton} />
      </View>
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
  },
  completeText: {
    fontSize: FontSizes.extraLarge,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 10,
    textAlign: 'center',
  },
  praiseText: {
    fontSize: FontSizes.large,
    color: Colors.secondaryBrown,
    marginBottom: 50,
    textAlign: 'center',
  },
  obooniCharacter: {
    width: 250,
    height: 250,
    marginBottom: 50,
  },
  homeButton: {
    width: '80%',
  },
});

export default TimeAttackCompleteScreen;
