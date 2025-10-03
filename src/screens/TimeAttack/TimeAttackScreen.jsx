// src/screens/TimeAttackScreen.jsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// 공통 스타일 및 컴포넌트 임포트
import { GlobalStyles } from '../../styles/GlobalStyles';
import { Colors } from '../../styles/color'; // <-- 사용자님 파일명에 맞춰 'color'로 수정!
import { FontSizes, FontWeights } from '../../styles/Fonts'; // <-- 사용자님 파일명에 맞춰 'Fonts'로 수정!
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import CharacterImage from '../../components/common/CharacterImage';
import { useTranslation } from 'react-i18next';

const TimeAttackScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const [customGoal, setCustomGoal] = useState(''); // 사용자 맞춤 목표

  // AI 추천 목표 (임시 데이터)
  const aiRecommendedGoals = [
    { id: 'ai_1', text: '방 정리' },
    { id: 'ai_2', text: '운동하기' },
    { id: 'ai_3', text: '책 읽기' },
  ];

  // AI 추천 목표 선택 또는 사용자 맞춤 목표 입력
  const handleSelectGoal = (goalText) => {
    Alert.alert(t('time_attack.select_goal_title'), t('time_attack.select_goal_message', { goal: goalText }));
    // 다음 화면으로 이동하여 시간 설정
    navigation.navigate('TimeAttackGoalSetting', { selectedGoal: goalText });
  };

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top }]}>
      <Header title={t('headers.time_attack')} showBackButton={true} />

      <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
        <Text style={styles.sectionTitle}>{t('time_attack.question_goal')}</Text>

        {/* AI 추천 목표 */}
        <View style={styles.aiGoalsContainer}>
          {aiRecommendedGoals.map(goal => (
            <TouchableOpacity 
              key={goal.id} 
              style={styles.aiGoalButton}
              onPress={() => handleSelectGoal(goal.text)}
            >
              <Text style={styles.aiGoalButtonText}>{goal.text}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 사용자 맞춤 설정 칸 */}
        <Text style={styles.sectionTitle}>{t('time_attack.manual_setup')}</Text>
        <TextInput
          style={styles.customGoalInput}
          placeholder={t('time_attack.input_placeholder')}
          placeholderTextColor={Colors.secondaryBrown}
          value={customGoal}
          onChangeText={setCustomGoal}
        />

        {/* 시작하기 버튼 */}
        <Button
          title={t('time_attack.start')}
          onPress={() => handleSelectGoal(customGoal || t('time_attack.default_goal'))} // 맞춤 목표 없으면 기본 목표로
          style={styles.startButton}
          disabled={!customGoal && !aiRecommendedGoals.length} // 둘 다 없으면 비활성화
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
  scrollViewContentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginTop: 25,
    marginBottom: 15,
    width: '100%',
    textAlign: 'left',
  },
  aiGoalsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    width: '100%',
    marginBottom: 20,
  },
  aiGoalButton: {
    backgroundColor: Colors.textLight,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginRight: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  aiGoalButtonText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
  },
  customGoalInput: {
    width: '100%',
    backgroundColor: Colors.textLight,
    borderRadius: 10,
    padding: 15,
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 30,
  },
  startButton: {
    width: '100%',
  },
});

export default TimeAttackScreen;
