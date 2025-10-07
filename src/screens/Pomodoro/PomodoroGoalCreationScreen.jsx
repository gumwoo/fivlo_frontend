// src/screens/Pomodoro/PomodoroGoalCreationScreen.jsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Modal, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';

import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Header from '../../components/common/Header';
import { useTranslation } from 'react-i18next';

// --- ✨ Figma 디자인에 맞춘 새로운 색상 팔레트 ---
const COLOR_PALETTE = [
  '#000000', '#D0C8B9', '#A89987', '#806F5D', '#584C3E',
  '#F5E6CC', '#F4C16E', '#F19F47', '#E3A1A0', '#D66565',
  '#E6F5E3', '#BBE3B8', '#99D194', '#C9EAF0', '#A8D8E3',
  '#DAD3EC', '#A999D4', '#B97FC9', '#8DB3E2', '#5989C8',
];

const PomodoroGoalCreationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const [goalText, setGoalText] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLOR_PALETTE[0]);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const [goals, setGoals] = useState([
    { id: 'g1', text: t('pomodoro_goals.study'), color: '#FFD1DC' },
    { id: 'g2', text: t('pomodoro_goals.exercise'), color: '#FFDD99' },
    { id: 'g3', text: t('pomodoro_goals.reading'), color: '#A0FFC3' },
    { id: 'g4', text: t('pomodoro_goals.organize'), color: '#ABFFFF' },
    { id: 'g5', text: t('pomodoro_goals.exam_study'), color: '#D1B5FF' },
  ]);
  
  // --- ✨ 새 목표 추가 로직 수정 ---
  const handleAddGoal = () => {
    if (!goalText.trim()) {
      Alert.alert(t('reminder.location_required_title'), t('pomodoro.create_goal_placeholder'));
      return;
    }
    const newGoal = {
      id: Date.now().toString(),
      text: goalText,
      color: selectedColor
    };
    setGoals(prevGoals => [...prevGoals, newGoal]);
    setGoalText(''); // 입력 필드 초기화
    setSelectedColor(COLOR_PALETTE[0]); // 색상 초기화
  };

  const handleSelectGoal = (goal) => {
    navigation.navigate('PomodoroTimer', { selectedGoal: goal });
  };

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

  // --- ✨ 기존 목표 리스트 아이템 UI 수정 ---
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
        <Text style={styles.deleteButtonText}>×</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top }]}>
      <Header title={t('pomodoro.create_header')} showBackButton={true} />

      <ScrollView contentContainerStyle={styles.scrollViewContentContainer} keyboardShouldPersistTaps="handled">
        <Text style={styles.sectionTitle}>{t('pomodoro.what_focus')}</Text>
        
        {/* 기존 목표 목록 */}
        <FlatList
          data={goals}
          renderItem={renderGoalItem}
          keyExtractor={item => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.goalListContent}
        />

        {/* --- ✨ 목표 작성 섹션을 별도 카드로 분리 --- */}
        <View style={styles.createSection}>
          <Text style={styles.createSectionTitle}>{t('pomodoro.create_goal_label')}</Text>
          <TextInput
            style={styles.goalInput}
            placeholder={t('pomodoro.create_goal_placeholder')}
            placeholderTextColor={Colors.secondaryBrown}
            value={goalText}
            onChangeText={setGoalText}
            multiline={true}
          />
          <TouchableOpacity style={styles.colorSettingButton} onPress={() => setShowColorPicker(true)}>
            <Text style={styles.colorSettingButtonText}>집중 그래프 색상 설정</Text>
          </TouchableOpacity>
          {/* 새 목표 추가 버튼 */}
          <TouchableOpacity style={styles.addButton} onPress={handleAddGoal}>
             <Text style={styles.addButtonText}>저장</Text>
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
            <Text style={styles.colorPickerTitle}>색상 설정</Text>
            <View style={styles.colorGrid}>
              {COLOR_PALETTE.map((color, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.colorItem, { backgroundColor: color }]}
                  onPress={() => setSelectedColor(color)}
                >
                  {selectedColor === color && (
                    <FontAwesome5 name="check" size={18} color={Colors.textLight} />
                  )}
                </TouchableOpacity>
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

// --- ✨ Figma 디자인에 맞춰 스타일 전면 수정 ---
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.primaryBeige,
  },
  scrollViewContentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginTop: 25,
    marginBottom: 20,
    width: '100%',
    textAlign: 'left',
  },
  goalListContent: {
    width: '100%',
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.primaryBeige,
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.secondaryBrown,
  },
  goalText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
  },
  deleteButton: {
    paddingHorizontal: 5,
  },
  deleteButtonText: {
    fontSize: 24,
    color: Colors.secondaryBrown,
  },
  createSection: {
    marginTop: 30,
    backgroundColor: Colors.primaryBeige, // 배경과 동일하게
  },
  createSectionTitle: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 15,
  },
  goalInput: {
    width: '100%',
    backgroundColor: Colors.textLight,
    borderRadius: 12,
    padding: 15,
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  colorSettingButton: {
    backgroundColor: Colors.textLight,
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  colorSettingButtonText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
  },
  addButton: {
    backgroundColor: Colors.accentApricot,
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: FontSizes.medium,
    color: Colors.textLight,
    fontWeight: FontWeights.bold,
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
  colorPickerTitle: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 20,
    textAlign: 'center',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  colorItem: {
    width: 50,
    height: 50,
    borderRadius: 8,
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  completeButtonText: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
  },
});

export default PomodoroGoalCreationScreen;