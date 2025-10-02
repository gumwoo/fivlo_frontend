// src/components/common/WeeklyTaskCard.jsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Button from './Button';

const WeeklyTaskCard = ({ weekNumber, tasks = [], onEditTask, onAddToTask }) => {
  const [checkedTasks, setCheckedTasks] = useState({});

  const handleTaskCheck = (taskId) => {
    setCheckedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const handleEditTask = (task) => {
    if (onEditTask) {
      onEditTask(task);
    }
  };

  const handleAddToTask = (task) => {
    if (onAddToTask) {
      onAddToTask(task);
    }
  };

  return (
    <View style={styles.card}>
      {/* 제목 */}
      <Text style={styles.title}>오분이가 추천하는 일정</Text>
      
      {/* 구분선 */}
      <View style={styles.divider} />
      
      {/* 주차별 할일 목록 */}
      <View style={styles.weekSection}>
        <Text style={styles.weekLabel}>{weekNumber}주차</Text>
        
        {tasks.map((task, index) => (
          <View key={task.id || index} style={styles.taskRow}>
            <TouchableOpacity 
              style={styles.checkbox}
              onPress={() => handleTaskCheck(task.id || index)}
            >
              {checkedTasks[task.id || index] && (
                <FontAwesome5 name="check" size={12} color={Colors.textLight} />
              )}
            </TouchableOpacity>
            <Text style={styles.taskText}>{task.text || t('weekly_task.default_task')}</Text>
          </View>
        ))}
      </View>
      
      {/* 하단 버튼들 */}
      <View style={styles.bottomSection}>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => handleEditTask(tasks[0])}
          >
            <FontAwesome5 name="edit" size={16} color={Colors.textDark} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.addTaskButton}
            onPress={() => handleAddToTask(tasks[0])}
          >
            <Text style={styles.addTaskButtonText}>TASK에 추가하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F5F5F5', // 연한 회색 배경
    borderRadius: 15,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: 10,
    textDecorationLine: 'underline',
    textDecorationColor: '#007AFF', // 파란색 밑줄
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 15,
  },
  weekSection: {
    marginBottom: 20,
  },
  weekLabel: {
    fontSize: FontSizes.medium,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 10,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: Colors.textDark,
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.textLight,
  },
  taskText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    flex: 1,
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    width: 40,
    height: 40,
    backgroundColor: Colors.textLight,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  addTaskButton: {
    backgroundColor: Colors.textLight,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  addTaskButtonText: {
    fontSize: FontSizes.small,
    color: Colors.textDark,
    fontWeight: FontWeights.medium,
  },
});

export default WeeklyTaskCard;
