// src/screens/TimeAttackAISubdivisionScreen.jsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, FlatList, TextInput, Modal } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';

// 공통 스타일 및 컴포넌트 임포트
import { GlobalStyles } from '../../styles/GlobalStyles';
import { Colors } from '../../styles/color'; // <-- 사용자님 파일명에 맞춰 'color'로 수정!
import { FontSizes, FontWeights } from '../../styles/Fonts'; // <-- 사용자님 파일명에 맞춰 'Fonts'로 수정!
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import CharacterImage from '../../components/common/CharacterImage';
import { useTranslation } from 'react-i18next';


const TimeAttackAISubdivisionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const { selectedGoal, totalMinutes } = route.params;

  const [isLoadingAI, setIsLoadingAI] = useState(true);
  const [subdividedTasks, setSubdividedTasks] = useState([]);

  const [isEditingTask, setIsEditingTask] = useState(false);
  const [currentEditingTask, setCurrentEditingTask] = useState(null);
  const [editedTaskText, setEditedTaskText] = useState('');
  const [editedTaskTime, setEditedTaskTime] = useState('');

  useEffect(() => {
    // AI 세분화 로직 시뮬레이션
    setTimeout(() => {
      const generatedTasks = [
        { id: 't1', text: t('time_attack_ai.ai_generated_tasks.hair_wash'), time: 5, unit: t('time_attack_ai.minute_unit'), editable: true },
        { id: 't2', text: t('time_attack_ai.ai_generated_tasks.shower'), time: 10, unit: t('time_attack_ai.minute_unit'), editable: true },
        { id: 't3', text: t('time_attack_ai.ai_generated_tasks.get_dressed'), time: 5, unit: t('time_attack_ai.minute_unit'), editable: true },
        { id: 't4', text: t('time_attack_ai.ai_generated_tasks.breakfast'), time: 15, unit: t('time_attack_ai.minute_unit'), editable: true },
        { id: 't5', text: t('time_attack_ai.ai_generated_tasks.trash'), time: 3, unit: t('time_attack_ai.minute_unit'), editable: true },
        { id: 't6', text: t('time_attack_ai.ai_generated_tasks.work_prep'), time: 10, unit: t('time_attack_ai.minute_unit'), editable: true },
      ];
      setSubdividedTasks(generatedTasks);
      setIsLoadingAI(false);
    }, 2000); // 2초 로딩 시뮬레이션
  }, []);

  const handleEditTask = (task) => {
    setCurrentEditingTask(task);
    setEditedTaskText(task.text);
    setEditedTaskTime(task.time.toString());
    setIsEditingTask(true);
  };

  const handleCancelEdit = () => {
    setIsEditingTask(false);
    setCurrentEditingTask(null);
    setEditedTaskText('');
    setEditedTaskTime('');
  };


  const handleAddNewTask = () => {
    setCurrentEditingTask({ id: 'new', text: '', time: 5 });
    setEditedTaskText('');
    setEditedTaskTime('5');
    setIsEditingTask(true);
  };

  const handleSaveEdit = () => {
    if (editedTaskText.trim() && editedTaskTime.trim()) {
      if (currentEditingTask.id === 'new') {
        // 새 태스크 추가
        const newTask = {
          id: `t${Date.now()}`,
          text: editedTaskText.trim(),
          time: parseInt(editedTaskTime),
          unit: t('time_attack_ai.minute_unit'),
          editable: true
        };
        setSubdividedTasks(prevTasks => [...prevTasks, newTask]);
      } else {
        // 기존 태스크 수정
        const updatedTasks = subdividedTasks.map(task => 
          task.id === currentEditingTask.id 
            ? { ...task, text: editedTaskText.trim(), time: parseInt(editedTaskTime) }
            : task
        );
        setSubdividedTasks(updatedTasks);
      }
      setIsEditingTask(false);
      setCurrentEditingTask(null);
      setEditedTaskText('');
      setEditedTaskTime('');
    }
  };

  const handleStartAttack = () => {
    Alert.alert(t('time_attack_ai.start_attack'), t('time_attack_ai.start_attack_alert'));
    navigation.navigate('TimeAttackInProgress', { selectedGoal, subdividedTasks });
  };

  const handleDeleteTask = (taskId) => {
    Alert.alert(
      t('time_attack_ai.delete_task_title'),
      t('time_attack_ai.delete_task_message'),
      [
        { text: t('time_attack_ai.cancel'), style: 'cancel' },
        { 
          text: t('time_attack_ai.delete'), 
          style: 'destructive',
          onPress: () => setSubdividedTasks(prevTasks => prevTasks.filter(task => task.id !== taskId))
        }
      ]
    );
  };


  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top }]}>
      <Header title={t('headers.time_attack')} showBackButton={true} />

      <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
        {isLoadingAI ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.secondaryBrown} />
            <Text style={styles.loadingText}>{t('time_attack_ai.loading_message')}</Text>
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>{t('time_attack_ai.complete_message')}</Text>
            {subdividedTasks.length > 0 ? (
              subdividedTasks.map((item) => (
                <TouchableOpacity key={item.id} style={styles.taskItem} onPress={() => handleEditTask(item)}>
                  <Text style={styles.taskText}>{item.text} - {item.time}분</Text>
                  <TouchableOpacity onPress={() => handleDeleteTask(item.id)} style={styles.deleteButton}>
                    <FontAwesome5 name="times" size={16} color={Colors.textDark} />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.emptyText}>{t('time_attack_ai.no_tasks')}</Text>
            )}
            
            {/* 추가 버튼 */}
            <TouchableOpacity style={styles.addTaskButton} onPress={handleAddNewTask}>
              <FontAwesome5 name="plus" size={24} color={Colors.textDark} />
            </TouchableOpacity>
            
            <Button
              title={t('time_attack_ai.start_attack')}
              onPress={handleStartAttack}
              style={styles.startButton}
            />
          </>
        )}
      </ScrollView>

      {/* 수정 모달 */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isEditingTask}
        onRequestClose={handleCancelEdit}
      >
        <View style={styles.editModalOverlay}>
          <View style={styles.editModalContent}>
            <Text style={styles.editModalTitle}>
              {currentEditingTask?.id === 'new' ? t('time_attack_ai.add_new_task') : t('time_attack_ai.edit_task')}
            </Text>
            <View style={styles.editModalInputContainer}>
              <TextInput
                style={styles.editModalTextInput}
                value={editedTaskText}
                onChangeText={setEditedTaskText}
                placeholder={t('time_attack_ai.task_content_placeholder')}
              />
              <TextInput
                style={styles.editModalTimeInput}
                value={editedTaskTime}
                onChangeText={(text) => setEditedTaskTime(text.replace(/[^0-9]/g, ''))}
                keyboardType="number-pad"
                maxLength={3}
                placeholder={t('time_attack_ai.minute_placeholder')}
              />
              <Text style={styles.editModalTimeUnit}>{t('time_attack_ai.minute_unit')}</Text>
            </View>
            <View style={styles.editModalButtons}>
              <Button title={t('time_attack_ai.cancel')} onPress={handleCancelEdit} primary={false} style={styles.editModalButton} />
              <Button title={t('time_attack_ai.save')} onPress={handleSaveEdit} style={styles.editModalButton} />
            </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
    marginBottom: 100,
  },
  loadingText: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.secondaryBrown,
    marginTop: 20,
    textAlign: 'center',
    lineHeight: 30,
  },
  sectionTitle: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginTop: 25,
    marginBottom: 15,
    width: '100%',
    textAlign: 'center',
    lineHeight: 30,
  },
  flatListContent: {
    width: '100%',
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.textDark,
    fontSize: FontSizes.medium,
    marginTop: 20,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.textLight,
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    minHeight: 70,
  },
  taskText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    flex: 1,
    marginRight: 20,
    lineHeight: 24,
    flexWrap: 'wrap',
  },
  deleteButton: {
    padding: 6,
    backgroundColor: Colors.primaryBeige,
    borderRadius: 4,
    minWidth: 28,
    minHeight: 28,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  addTaskButton: {
    backgroundColor: Colors.textLight,
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  startButton: {
    marginTop: 10,
    width: '100%',
  },
  // 수정 모달 스타일
  editModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  editModalContent: {
    backgroundColor: Colors.textLight,
    borderRadius: 20,
    padding: 25,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  editModalTitle: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 20,
  },
  editModalInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    backgroundColor: Colors.primaryBeige,
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  editModalTextInput: {
    flex: 1,
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    minHeight: 50,
    textAlignVertical: 'center',
  },
  editModalTimeInput: {
    width: 60,
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    textAlign: 'right',
    marginRight: 5,
  },
  editModalTimeUnit: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
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

export default TimeAttackAISubdivisionScreen;
