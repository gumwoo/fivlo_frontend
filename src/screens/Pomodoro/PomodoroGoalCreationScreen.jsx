
// src/screens/Pomodoro/PomodoroGoalCreationScreen.jsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Modal, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Header from '../../components/common/Header';
import { useTranslation } from 'react-i18next';

// --- 피그마 디자인에 맞는 색상 팔레트 ---
const COLOR_PALETTE = [
  '#000000', '#D0C8B9', '#A89987', '#806F5D', '#584C3E',
  '#F5E6CC', '#F4C16E', '#F19F47', '#E3A1A0', '#D66565',
  '#E6F5E3', '#BBE3B8', '#99D194', '#C9EAF0', '#A8D8E3',
  '#DAD3EC', '#A999D4', '#B97FC9', '#8DB3E2', '#5989C8',
];

const PomodoroGoalCreationScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  // --- ✨ 화면 상태 관리를 위한 state 추가 ---
  const [isCreating, setIsCreating] = useState(false);

  const [goalText, setGoalText] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLOR_PALETTE[6]); // 주황색 기본
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [goals, setGoals] = useState([
    { id: 'g1', text: t('pomodoro_goals.study'), color: '#FFD1DC' },
    { id: 'g2', text: t('pomodoro_goals.exercise'), color: '#FFDD99' },
    { id: 'g3', text: t('pomodoro_goals.reading'), color: '#A0FFC3' },
    { id: 'g4', text: t('pomodoro_goals.organize'), color: '#ABFFFF' },
    { id: 'g5', text: t('pomodoro_goals.exam_study'), color: '#D1B5FF' },
  ]);

  const handleSaveNewGoal = () => {
    if (!goalText.trim()) {
      Alert.alert(t('reminder.location_required_title'), t('pomodoro.create_goal_placeholder'));
      return;
    }
    const newGoal = {
      id: Date.now().toString(),
      text: goalText,
      color: selectedColor,
    };
    setGoals(prevGoals => [...prevGoals, newGoal]);
    setGoalText('');
    setSelectedColor(COLOR_PALETTE[6]);
    setIsCreating(false); // 저장 후 목록 화면으로 전환
  };

  const handleSelectGoal = (goal) => {
    navigation.navigate('PomodoroStartConfirmModal', {
      goal,
      onConfirm: () => navigation.navigate('PomodoroTimer', { selectedGoal: goal }),
      onCancel: () => {},
    });
  };

  const handleDeleteGoal = (goalId) => {
    setGoals(prevGoals => prevGoals.filter(goal => goal.id !== goalId));
  };
  
  // --- ✨ 목표 목록 아이템 UI ---
  const renderGoalItem = ({ item }) => (
    <TouchableOpacity
      style={styles.goalItem}
      onPress={() => handleSelectGoal(item)}
    >
      <View style={[styles.goalItemColor, { backgroundColor: item.color }]} />
      <Text style={styles.goalText}>{item.text}</Text>
      <TouchableOpacity onPress={() => handleDeleteGoal(item.id)}>
        <FontAwesome5 name="times-circle" size={20} color={Colors.secondaryBrown} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  // --- ✨ 새 목표 작성 UI ---
  const renderCreationForm = () => (
    <View>
      <Text style={styles.createSectionTitle}>{t('pomodoro.create_goal_label')}</Text>
      <TextInput
        style={styles.goalInput}
        placeholder={t('pomodoro.create_goal_placeholder')}
        placeholderTextColor={Colors.secondaryBrown}
        value={goalText}
        onChangeText={setGoalText}
      />
      
      <Text style={styles.createSectionTitle}>{t('pomodoro.color_label')}</Text>
      <TouchableOpacity style={styles.colorDisplayButton} onPress={() => setShowColorPicker(true)}>
        <View style={[styles.selectedColorPreview, { backgroundColor: selectedColor }]} />
        <Text style={styles.colorButtonText}>{t('pomodoro.color_select')}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveNewGoal}>
        <Text style={styles.saveButtonText}>{t('pomodoro.save')}</Text>
      </TouchableOpacity>
    </View>
  );

  // --- ✨ 목표 목록 UI ---
  const renderGoalList = () => (
    <>
      <Text style={styles.sectionTitle}>{t('pomodoro.selection_header')}</Text>
      {goals.length > 0 ? (
        <FlatList
          data={goals}
          renderItem={renderGoalItem}
          keyExtractor={item => item.id}
          scrollEnabled={false}
        />
      ) : (
        <Text style={styles.noGoalsText}>{t('pomodoro.no_goals')}</Text>
      )}
      <TouchableOpacity style={styles.createGoalButton} onPress={() => setIsCreating(true)}>
        <Text style={styles.createGoalButtonText}>{t('pomodoro.create_new_goal')}</Text>
      </TouchableOpacity>
    </>
  );

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top }]}>
      <Header 
        title={isCreating ? t('pomodoro.create_header') : t('pomodoro.header')} 
        showBackButton={true} 
        // 뒤로가기 버튼 동작을 isCreating 상태에 따라 다르게 설정
        onBackPress={isCreating ? () => setIsCreating(false) : null}
      />

      <ScrollView contentContainerStyle={styles.scrollViewContentContainer} keyboardShouldPersistTaps="handled">
        {isCreating ? renderCreationForm() : renderGoalList()}
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
            <Text style={styles.colorPickerTitle}>{t('pomodoro.color_modal_title')}</Text>
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
            <TouchableOpacity style={styles.completeButton} onPress={() => setShowColorPicker(false)}>
              <Text style={styles.completeButtonText}>{t('pomodoro.done')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// --- ✨ Figma 디자인에 맞춰 스타일 전면 수정 ---
const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: Colors.primaryBeige },
  scrollViewContentContainer: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 10 },
  sectionTitle: { fontSize: FontSizes.large, fontWeight: FontWeights.bold, color: Colors.textDark, marginBottom: 20, textAlign: 'center' },
  goalItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.textLight, borderRadius: 12, padding: 15, marginBottom: 10, elevation: 1, shadowOpacity: 0.1, shadowRadius: 2, shadowOffset: { width: 0, height: 1 } },
  goalItemColor: { width: 12, height: 12, borderRadius: 6, marginRight: 12 },
  goalText: { flex: 1, fontSize: FontSizes.medium, color: Colors.textDark },
  noGoalsText: { textAlign: 'center', color: Colors.secondaryBrown, marginVertical: 40, fontSize: FontSizes.medium },
  createGoalButton: { backgroundColor: Colors.accentApricot, borderRadius: 12, padding: 18, alignItems: 'center', marginTop: 20 },
  createGoalButtonText: { fontSize: FontSizes.medium, color: Colors.textLight, fontWeight: FontWeights.bold },
  
  // 목표 작성 폼 스타일
  createSectionTitle: { fontSize: FontSizes.large, fontWeight: FontWeights.bold, color: Colors.textDark, marginBottom: 15, marginTop: 10 },
  goalInput: { width: '100%', backgroundColor: Colors.textLight, borderRadius: 12, padding: 15, fontSize: FontSizes.medium, color: Colors.textDark, marginBottom: 25 },
  colorDisplayButton: { flexDirection: 'row', alignItems: 'center', width: '100%', backgroundColor: Colors.textLight, borderRadius: 12, padding: 15, marginBottom: 30 },
  selectedColorPreview: { width: 24, height: 24, borderRadius: 6, marginRight: 12, borderWidth: 1, borderColor: Colors.secondaryBrown + '80' },
  colorButtonText: { fontSize: FontSizes.medium, color: Colors.textDark },
  saveButton: { backgroundColor: Colors.accentApricot, borderRadius: 12, padding: 18, alignItems: 'center' },
  saveButtonText: { fontSize: FontSizes.medium, color: Colors.textLight, fontWeight: FontWeights.bold },

  // 색상 선택 모달 스타일
  colorPickerOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  colorPickerContent: { backgroundColor: Colors.textLight, borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingVertical: 20, paddingHorizontal: 10 },
  colorPickerTitle: { fontSize: FontSizes.large, fontWeight: FontWeights.bold, color: Colors.textDark, marginBottom: 20, textAlign: 'center' },
  colorGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 20 },
  colorItem: { width: 50, height: 50, borderRadius: 8, margin: 8, justifyContent: 'center', alignItems: 'center' },
  completeButton: { backgroundColor: '#FFD700', paddingVertical: 15, marginHorizontal: 10, borderRadius: 10, alignItems: 'center' },
  completeButtonText: { fontSize: FontSizes.large, fontWeight: FontWeights.bold, color: Colors.textDark },
});

export default PomodoroGoalCreationScreen;
