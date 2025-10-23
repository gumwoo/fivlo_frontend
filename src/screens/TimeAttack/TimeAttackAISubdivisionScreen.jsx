// src/screens/TimeAttack/TimeAttackAISubdivisionScreen.jsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, FlatList, TextInput, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';

import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import TimeAttackMascot from '../../components/timeattack/TimeAttackMascot';
import { useTranslation } from 'react-i18next';

const TimeAttackAISubdivisionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const { selectedGoal, totalMinutes } = route.params;

  const [isLoadingAI, setIsLoadingAI] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setTasks([
        { id: 't1', text: '머리감기', time: 10 },
        { id: 't2', text: '화장하기', time: 15 },
        { id: 't3', text: '가방 챙기기', time: 5 },
        { id: 't4', text: '이동 준비', time: 10 },
      ]);
      setIsLoadingAI(false);
    }, 1500);
  }, []);

  const handleUpdateTask = (id, newValues) => {
    setTasks(currentTasks => 
      currentTasks.map(task => (task.id === id ? { ...task, ...newValues } : task))
    );
  };
  
  const handleAddNewTask = () => {
    const newId = `new-${Date.now()}`;
    setTasks([...tasks, { id: newId, text: '', time: 5 }]);
    setEditingTaskId(newId); // 바로 편집 모드로
  };

  const handleDeleteTask = (taskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  const handleStartAttack = () => {
    if (tasks.some(task => !task.text.trim())) {
      Alert.alert(t('time_attack_ai.alert_title'), t('time_attack_ai.empty_content_message'));
      return;
    }
    navigation.navigate('TimeAttackInProgress', { selectedGoal, subdividedTasks: tasks });
  };
  
  const renderTaskItem = ({ item }) => {
    const isEditing = editingTaskId === item.id;
    if (isEditing) {
      return (
        <View style={[styles.taskItem, styles.taskItemEditing]}>
          <TextInput
            style={styles.taskInput}
            value={item.text}
            onChangeText={(text) => handleUpdateTask(item.id, { text })}
            autoFocus
            placeholder={t('time_attack_ai.input_content_placeholder')}
          />
          <View style={styles.timeInputContainer}>
            <TextInput
              style={styles.timeInput}
              value={String(item.time)}
              onChangeText={(time) => handleUpdateTask(item.id, { time: time.replace(/[^0-9]/g, '') })}
              keyboardType="number-pad"
              maxLength={3}
            />
            <Text style={styles.timeUnit}>{t('time_attack_ai.minute_unit')}</Text>
          </View>
          <TouchableOpacity onPress={() => setEditingTaskId(null)} style={styles.doneButton}>
            <Text style={styles.doneButtonText}>{t('time_attack_ai.complete_button')}</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    return (
      <TouchableOpacity style={styles.taskItem} onLongPress={() => setEditingTaskId(item.id)}>
        <Text style={styles.taskText}>{item.text}</Text>
        <Text style={styles.taskTime}>- {item.time}{t('time_attack_ai.minute_unit')}</Text>
        <TouchableOpacity onPress={() => handleDeleteTask(item.id)} style={styles.deleteButton}>
          <FontAwesome5 name="times" size={16} color={Colors.secondaryBrown} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top }]}>
      <Header title={t('headers.time_attack')} showBackButton={true} />
      {isLoadingAI ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.secondaryBrown} />
        </View>
      ) : (
        <>
          <View style={{ alignItems: 'center', marginTop: 10 }}>
          </View>
          <Text style={styles.title}>{t('time_attack_ai.ai_message', { totalMinutes })}</Text>
          <FlatList
            data={tasks}
            renderItem={renderTaskItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
            ListFooterComponent={
              <TouchableOpacity style={[styles.taskItem, styles.addTaskButton]} onPress={handleAddNewTask}>
                <FontAwesome5 name="plus" size={16} color={Colors.secondaryBrown} />
              </TouchableOpacity>
            }
          />
          <View style={styles.footer}>
            <Button
              title={t('time_attack_ai.start_attack')}
              onPress={handleStartAttack}
              style={styles.startButton}
              textStyle={styles.startButtonText}
            />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: Colors.primaryBeige },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: FontSizes.large, fontWeight: FontWeights.bold, color: Colors.textDark, textAlign: 'center', margin: 20, lineHeight: 28 },
  listContainer: { paddingHorizontal: 20 },
  taskItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.textLight, borderRadius: 10, paddingVertical: 20, paddingHorizontal: 15, marginBottom: 15 },
  taskItemEditing: { backgroundColor: '#fff', borderColor: '#FFD700', borderWidth: 2, paddingVertical: 10 },
  taskText: { flex: 1, fontSize: FontSizes.medium, color: Colors.textDark },
  taskTime: { fontSize: FontSizes.medium, color: Colors.textDark, fontWeight: '600', marginLeft: 10 },
  deleteButton: { padding: 5, marginLeft: 15 },
  addTaskButton: { justifyContent: 'center' },
  taskInput: { flex: 1, fontSize: FontSizes.medium, color: Colors.textDark },
  timeInputContainer: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 },
  timeInput: { fontSize: FontSizes.medium, color: Colors.textDark, fontWeight: '600', minWidth: 30, textAlign: 'right' },
  timeUnit: { fontSize: FontSizes.medium, color: Colors.textDark, marginLeft: 4 },
  doneButton: { backgroundColor: '#FFD700', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  doneButtonText: { color: Colors.textDark, fontWeight: 'bold' },
  footer: { padding: 20, backgroundColor: Colors.primaryBeige },
  startButton: { backgroundColor: '#FFD700', borderRadius: 10, paddingVertical: 15, marginBottom:80 },
  startButtonText: { color: Colors.textDark, fontSize: FontSizes.large, fontWeight: 'bold' },
});

export default TimeAttackAISubdivisionScreen;
