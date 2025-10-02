// src/screens/PomodoroGoalCreationScreen.jsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Modal, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons'; // 아이콘 사용

// 공통 스타일 및 컴포넌트 임포트
import { GlobalStyles } from '../../styles/GlobalStyles';
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import { useTranslation } from 'react-i18next';

// 포모도로 목표 색상 팔레트 (5열 4행, 총 20개)
const COLOR_PALETTE = [
  '#000000', '#F5F5DC', '#D2B48C', '#8B4513', '#654321', // 1행
  '#FFF8DC', '#FFA500', '#FF8C00', '#FFB6C1', '#FF0000', // 2행 (주황색이 7번째)
  '#F0FFF0', '#90EE90', '#98FB98', '#B0E0E6', '#AFEEEE', // 3행
  '#E6E6FA', '#9370DB', '#FF00FF', '#0000FF', '#000080', // 4행
];

const PomodoroGoalCreationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const [goalText, setGoalText] = useState(''); // 목표 텍스트
  const [selectedColor, setSelectedColor] = useState(COLOR_PALETTE[6]); // 주황색이 기본 선택 (7번째)
  const [showColorPicker, setShowColorPicker] = useState(false); // 색상 선택기 모달 표시 여부

  // 기존 목표 목록
  const [goals, setGoals] = useState([
    { id: 'g1', text: t('pomodoro_goals.study'), color: '#FFD1DC' },
    { id: 'g2', text: t('pomodoro_goals.exercise'), color: '#FFDD99' },
    { id: 'g3', text: t('pomodoro_goals.reading'), color: '#A0FFC3' },
    { id: 'g4', text: t('pomodoro_goals.organize'), color: '#ABFFFF' },
    { id: 'g5', text: t('pomodoro_goals.exam_study'), color: '#D1B5FF' },
  ]);

  // 새 목표 추가 처리
  useEffect(() => {
    if (route.params?.newGoal) {
      setGoals(prevGoals => {
        if (!prevGoals.some(goal => goal.id === route.params.newGoal.id)) {
          return [...prevGoals, route.params.newGoal];
        }
        return prevGoals;
      });
      navigation.setParams({ newGoal: undefined });
    }
  }, [route.params?.newGoal]);

  // "완료" 버튼 클릭 핸들러
  const handleComplete = () => {
    if (!goalText.trim()) {
      Alert.alert(t('reminder.location_required_title'), t('pomodoro.create_goal_placeholder'));
      return;
    }
    // 목표와 색상을 저장하고 목표 목록에 추가
    const newGoal = {
      id: Date.now().toString(),
      text: goalText,
      color: selectedColor
    };
    setGoals(prevGoals => [...prevGoals, newGoal]);
    setGoalText(''); // 입력 필드 초기화
    setSelectedColor(COLOR_PALETTE[6]); // 색상 초기화 (주황색)
  };

  // 색상 설정 버튼 클릭 핸들러
  const handleColorSetting = () => {
    setShowColorPicker(true);
  };

  // 목표 선택 및 포모도로 시작
  const handleSelectGoal = (goal) => {
    navigation.navigate('PomodoroTimer', { selectedGoal: goal });
  };

  // 목표 삭제 핸들러
  const handleDeleteGoal = (goalId) => {
    Alert.alert(
      '목표 삭제',
      t('time_attack_ai.delete_task_message'),
      [
        { text: t('time_attack_ai.cancel'), style: 'cancel' },
        { 
          text: t('time_attack_ai.delete'), 
          style: 'destructive',
          onPress: () => setGoals(prevGoals => prevGoals.filter(goal => goal.id !== goalId))
        }
      ]
    );
  };

  // 목표 아이템 렌더링
  const renderGoalItem = ({ item }) => (
    <TouchableOpacity
      style={styles.goalItem}
      onPress={() => handleSelectGoal(item)}
    >
      <Text style={styles.goalText}>{item.text}</Text>
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => handleDeleteGoal(item.id)}
      >
        <FontAwesome5 name="times" size={16} color={Colors.textDark} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top + 20 }]}>
      <Header title={t('pomodoro.create_header')} showBackButton={true} />

      <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
        <Text style={styles.sectionTitle}>{t('pomodoro.what_focus')}</Text>
        
        {/* 기존 목표 목록 */}
        {goals.length > 0 && (
          <FlatList
            data={goals}
            renderItem={renderGoalItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.goalListContent}
          />
        )}

        {/* 목표 작성 섹션 */}
        <View style={styles.createSection}>
          <Text style={styles.createSectionTitle}>{t('pomodoro.create_goal_label')}</Text>
          <TextInput
            style={styles.goalInput}
            placeholder={t('pomodoro.create_goal_placeholder')}
            placeholderTextColor={Colors.secondaryBrown}
            value={goalText}
            onChangeText={setGoalText}
            multiline={true}
            numberOfLines={3}
            textAlignVertical="top"
          />

          {/* 색상 설정 칸 */}
          <TouchableOpacity style={styles.colorSettingButton} onPress={handleColorSetting}>
            <Text style={styles.colorSettingButtonText}>집중 그래프 색상 설정</Text>
          </TouchableOpacity>

          {/* 완료 버튼 */}
          <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
            <Text style={styles.completeButtonText}>완료</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 색상 선택 모달 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showColorPicker}
        onRequestClose={() => setShowColorPicker(false)}
      >
        <View style={styles.colorPickerOverlay}>
          <View style={styles.colorPickerContent}>
            <View style={styles.colorPickerHeader}>
              <Text style={styles.colorPickerTitle}>색상 설정</Text>
              <View style={styles.colorIndicator}>
                <Text style={styles.colorIndicatorText}>7</Text>
              </View>
            </View>
            
            <View style={styles.colorGrid}>
              {COLOR_PALETTE.map((color, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.colorItem,
                    { backgroundColor: color },
                    selectedColor === color && styles.selectedColorItem
                  ]}
                  onPress={() => {
                    setSelectedColor(color);
                    setShowColorPicker(false);
                  }}
                />
              ))}
            </View>
            
            <TouchableOpacity 
              style={styles.completeButton} 
              onPress={() => setShowColorPicker(false)}
            >
              <Text style={styles.completeButtonText}>완료</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    marginBottom: 20,
    width: '100%',
    textAlign: 'center',
  },
  goalListContent: {
    width: '100%',
    marginBottom: 20,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.primaryBeige,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.secondaryBrown,
    width: '100%',
  },
  goalText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    flex: 1,
  },
  deleteButton: {
    padding: 5,
  },
  createSection: {
    width: '100%',
    marginTop: 20,
  },
  createSectionTitle: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 10,
    width: '100%',
    textAlign: 'left',
  },
  goalInput: {
    width: '100%',
    backgroundColor: Colors.textLight,
    borderRadius: 10,
    padding: 15,
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    minHeight: 100,
    textAlignVertical: 'top',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  colorDisplayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: Colors.textLight,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedColorPreview: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 15,
    borderWidth: 1,
    borderColor: Colors.secondaryBrown,
  },
  colorSettingButton: {
    backgroundColor: Colors.textLight,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  colorSettingButtonText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    fontWeight: FontWeights.medium,
  },
  completeButton: {
    backgroundColor: '#FFD700', // 노란색
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
  },
  completeButtonText: {
    color: Colors.textLight,
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
  },
  colorButtonText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
  },
  saveButton: {
    marginTop: 40,
    width: '100%',
  },
  // 색상 선택 모달 스타일
  colorPickerOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  colorPickerContent: {
    backgroundColor: Colors.textLight,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  colorPickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  colorPickerTitle: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginRight: 15,
  },
  colorIndicator: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.textDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorIndicatorText: {
    color: Colors.textLight,
    fontSize: FontSizes.small,
    fontWeight: FontWeights.bold,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  colorItem: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColorItem: {
    borderColor: '#007AFF', // 파란색 테두리
    borderWidth: 3,
  },
  completeButton: {
    backgroundColor: '#FFD700', // 노란색
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  completeButtonText: {
    color: Colors.textLight,
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
  },
});

export default PomodoroGoalCreationScreen;
