// src/screens/PomodoroScreen.jsx

import React from 'react';
// --- 수정: Image 컴포넌트 임포트 ---
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// 공통 스타일 및 컴포넌트 임포트
import { GlobalStyles } from '../../styles/GlobalStyles';
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Header from '../../components/common/Header';
import { useTranslation } from 'react-i18next';

const PomodoroScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  // "집중 목표 작성하기" 버튼 클릭 핸들러
  const handleCreateGoal = () => {
    navigation.navigate('PomodoroGoalCreation');
  };


  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top }]}>
      <Header title={t('pomodoro.header')} showBackButton={true} />

      <View style={styles.contentContainer}>
        <Text style={styles.questionText}>{t('pomodoro.what_focus')}</Text>
        
        {/* --- 수정: 요청하신 새 이미지로 변경 --- */}
        {/* '/assets/images/' 경로에 'obooni_pomodoro.png'와 같은 이름으로 새 이미지를 추가해주세요. */}
        <Image
          source={require('../../../assets/book.png')}
          style={styles.mainCharacterImage}
        />

        {/* --- 추가: 이미지 하단 부제 텍스트 --- */}
        <Text style={styles.subtitleText}>{t('pomodoro.lets_focus')}</Text>

        {/* --- 수정: 버튼 UI 변경 --- */}
        <TouchableOpacity style={styles.createGoalButton} onPress={handleCreateGoal}>
          <Text style={styles.createGoalButtonText}>{t('pomodoro.create_goal')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.primaryBeige, // 이미지에 맞는 배경색
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30, // 좌우 여백 조정
    paddingBottom: 80,
  },
  questionText: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 30,
    textAlign: 'center',
  },
  // --- 수정: 메인 캐릭터 이미지 스타일 ---
  mainCharacterImage: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  // --- 추가: 부제 텍스트 스타일 ---
  subtitleText: {
    fontSize: FontSizes.large,
    color: Colors.textDark,
    fontWeight: FontWeights.bold,
    marginBottom: 40,
  },
  // --- 수정: 버튼 스타일 ---
  createGoalButton: {
    backgroundColor: Colors.textLight, // 밝은 배경색
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: '100%', // 너비 꽉 채우기
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EFEBE4', // 아주 연한 테두리
  },
  // --- 수정: 버튼 텍스트 스타일 ---
  createGoalButtonText: {
    fontSize: FontSizes.medium,
    fontWeight: FontWeights.medium, // 굵기 보통으로
    color: Colors.textDark, // 어두운 텍스트 색상
  },
});

export default PomodoroScreen;