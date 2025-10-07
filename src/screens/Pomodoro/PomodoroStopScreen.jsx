// src/screens/PomodoroStopScreen.jsx

import React from 'react';
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

const PomodoroStopScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const { selectedGoal } = route.params;

  const handleGoToAnalysis = () => {
    Alert.alert(t('pomodoro.navigate'), t('pomodoro.navigate_to_analysis'));
  };

  const handleGoToHome = () => {
    navigation.popToTop();
    navigation.navigate('Main', { screen: 'HomeTab' });
  };

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top }]}>
      <Header title={t('pomodoro.header')} showBackButton={true} />

      <ScrollView contentContainerStyle={styles.contentContainer}> {/* ScrollView로 감싸기 */}
        <Text style={styles.stopText}>{t('pomodoro.stop_title_generic')}</Text>
        <Text style={styles.stopMessage}>{t('pomodoro.stop_message')}</Text>
        
        <CharacterImage style={styles.obooniCharacter} />
        
        <View style={styles.buttonContainer}>
          <Button title={t('pomodoro.to_analysis')} onPress={handleGoToAnalysis} style={styles.actionButton} />
          <Button title={t('pomodoro.to_home')} onPress={handleGoToHome} primary={false} style={styles.actionButton} />
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
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  stopText: {
    fontSize: FontSizes.extraLarge,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 10,
    textAlign: 'center',
  },
  stopMessage: {
    fontSize: FontSizes.large,
    color: Colors.secondaryBrown,
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
});

export default PomodoroStopScreen;
