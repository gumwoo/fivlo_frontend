// src/screens/RoutineSettingScreen.jsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, ActivityIndicator, Modal, TextInput, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';

// 공통 스타일 및 컴포넌트 임포트
import { GlobalStyles } from '../styles/GlobalStyles';
import { Colors } from '../styles/color';
import { FontSizes, FontWeights } from '../styles/Fonts';
import Header from '../components/common/Header';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import WeeklyTaskCard from '../components/common/WeeklyTaskCard';
import { useTranslation } from 'react-i18next';

const RoutineSettingScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();

  const [goal, setGoal] = useState('');
  const [targetDate, setTargetDate] = useState(new Date());
  const [isContinuous, setIsContinuous] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiRecommendedTasks, setAiRecommendedTasks] = useState([]);
  const [isEditingTask, setIsEditingTask] = useState(false);
  const [currentEditingTask, setCurrentEditingTask] = useState(null);
  const [editedTaskText, setEditedTaskText] = useState('');

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || targetDate;
    setShowDatePicker(false);
    setTargetDate(currentDate);
  };

  const handleGenerateSchedule = () => {
    if (!goal.trim()) {
      Alert.alert(t('core.routine.required_title'), t('core.routine.required_goal'));
      return;
    }

    setIsLoadingAI(true);
    setAiRecommendedTasks([]);

    setTimeout(() => {
      const generatedTasks = [
        { id: 'ai1', text: '매일 아침 10분 스트레칭', type: 'daily', week: 1, editable: true },
        { id: 'ai2', text: '주 3회 헬스장 방문', type: 'weekly', week: 1, editable: true },
        { id: 'ai3', text: '매일 저녁 샐러드 먹기', type: 'daily', week: 1, editable: true },
        { id: 'ai4', text: '매주 주말 등산하기', type: 'weekly', week: 2, editable: true },
        { id: 'ai5', text: '매일 자기 전 명상 5분', type: 'daily', week: 2, editable: true },
        { id: 'ai6', text: '매월 첫째 주 목표 점검', type: 'monthly', week: 2, editable: true },
      ];
      setAiRecommendedTasks(generatedTasks);
      setIsLoadingAI(false);
    }, 2000);
  };

  const handleAddTaskToTask = (task) => {
    Alert.alert('TASK에 추가', `"${task.text}" 항목을 TASK에 추가합니다.`);
  };

  const handleEditIconClick = (task) => {
    setCurrentEditingTask(task);
    setEditedTaskText(task.text);
    setIsEditingTask(true);
  };

  const handleSaveEditedTask = () => {
    setAiRecommendedTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === currentEditingTask.id ? { ...task, text: editedTaskText } : task
      )
    );
    setIsEditingTask(false);
    setCurrentEditingTask(null);
    setEditedTaskText('');
    Alert.alert('저장 완료', '일정이 수정되었습니다.');
  };

  const handleCancelEdit = () => {
    setIsEditingTask(false);
    setCurrentEditingTask(null);
    setEditedTaskText('');
  };

  const groupTasksByWeek = (tasks) => {
    const grouped = {};
    tasks.forEach(task => {
      const week = task.week || 1;
      if (!grouped[week]) {
        grouped[week] = [];
      }
      grouped[week].push(task);
    });
    return grouped;
  };

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top + 20 }]}>
      <Header title={t('core.routine.header')} showBackButton={true} />

      <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
        <Text style={styles.sectionTitle}>{t('core.routine.goal_input_label')}</Text>
        <Input
          placeholder={t('core.routine.goal_input_placeholder')}
          value={goal}
          onChangeText={setGoal}
          multiline={true}
          numberOfLines={3}
          style={styles.goalInput}
        />

        <Text style={styles.sectionTitle}>{t('core.routine.target_period_label')}</Text>
        <View style={styles.dateOptionContainer}>
          <TouchableOpacity
            style={[styles.dateOptionButton, isContinuous && styles.dateOptionButtonActive]}
            onPress={() => setIsContinuous(true)}
          >
            <Text style={[styles.dateOptionText, isContinuous && styles.dateOptionTextActive]}>{t('core.routine.continuous')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.dateOptionButton, !isContinuous && styles.dateOptionButtonActive]}
            onPress={() => setIsContinuous(false)}
          >
            <Text style={[styles.dateOptionText, !isContinuous && styles.dateOptionTextActive]}>{t('core.routine.set_period')}</Text>
          </TouchableOpacity>
        </View>

        {!isContinuous && (
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
            <Text style={styles.datePickerButtonText}>
              {format(targetDate, i18n.language === 'ko' ? 'yyyy년 MM월 dd일' : 'yyyy-MM-dd')}
            </Text>
          </TouchableOpacity>
        )}
        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={targetDate}
            mode="date"
            display="default"
            onChange={onChangeDate}
            minimumDate={new Date()}
          />
        )}

        <Button
          title={t('core.routine.generate')}
          onPress={handleGenerateSchedule}
          style={styles.generateButton}
        />

        {isLoadingAI && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.secondaryBrown} />
            <Text style={styles.loadingText}>{t('core.routine.loading')}</Text>
          </View>
        )}

        {/* AI가 추천하는 반복일정 칸 (수정된 부분) */}
        {aiRecommendedTasks.length > 0 && !isLoadingAI && (
          <View style={styles.aiRecommendationsContainer}>
            <View style={styles.weeklyGoalsContainer}>
              {Object.entries(groupTasksByWeek(aiRecommendedTasks)).map(([week, tasks]) => (
                <WeeklyTaskCard
                  key={week}
                  weekNumber={parseInt(week)}
                  tasks={tasks}
                  onEditTask={handleEditIconClick}
                  onAddToTask={handleAddTaskToTask}
                />
              ))}
            </View>
          </View>
        )}

        {/* 수정 모달 */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={isEditingTask}
          onRequestClose={handleCancelEdit}
        >
          <View style={styles.editModalOverlay}>
            <View style={styles.editModalContent}>
              <Text style={styles.editModalTitle}>{t('core.routine.edit_title')}</Text>
              <TextInput
                style={styles.editModalInput}
                value={editedTaskText}
                onChangeText={setEditedTaskText}
                multiline={true}
                numberOfLines={3}
                textAlignVertical="top"
              />
              <View style={styles.editModalButtons}>
                <Button title={t('task.cancel')} onPress={handleCancelEdit} primary={false} style={styles.editModalButton} />
                <Button title={t('task.save')} onPress={handleSaveEditedTask} style={styles.editModalButton} />
              </View>
            </View>
          </View>
        </Modal>
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
    marginBottom: 10,
    width: '100%',
    textAlign: 'left',
  },
  goalInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 15,
    paddingBottom: 15,
  },
  dateOptionContainer: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: Colors.textLight,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dateOptionButton: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 10,
  },
  dateOptionButtonActive: {
    backgroundColor: Colors.accentApricot,
  },
  dateOptionText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    fontWeight: FontWeights.regular,
  },
  dateOptionTextActive: {
    color: Colors.textLight,
    fontWeight: FontWeights.bold,
  },
  datePickerButton: {
    width: '100%',
    backgroundColor: Colors.textLight,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  datePickerButtonText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    fontWeight: FontWeights.regular,
  },
  generateButton: {
    marginTop: 10,
    marginBottom: 30,
  },
  loadingContainer: {
    marginTop: 50,
    alignItems: 'center',
    marginBottom: 50,
  },
  loadingText: {
    fontSize: FontSizes.medium,
    color: Colors.secondaryBrown,
    marginTop: 15,
    textAlign: 'center',
    lineHeight: 24,
  },
  aiRecommendationsContainer: {
    width: '100%',
    backgroundColor: Colors.textLight,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  weeklyGoalsContainer: {
    width: '100%',
  },
  editModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  editModalContent: {
    backgroundColor: Colors.textLight,
    borderRadius: 15,
    padding: 25,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  editModalTitle: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 20,
  },
  editModalInput: {
    width: '100%',
    backgroundColor: Colors.primaryBeige,
    borderRadius: 10,
    padding: 15,
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    minHeight: 100,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.secondaryBrown,
  },
  editModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  editModalButton: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default RoutineSettingScreen;