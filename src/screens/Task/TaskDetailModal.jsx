// src/screens/TaskDetailModal.jsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Alert, FlatList, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { FontAwesome5 } from '@expo/vector-icons';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

// 공통 스타일 및 컴포넌트 임포트
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Button from '../../components/common/Button';
import { useTranslation } from 'react-i18next';

// TaskEditModal, TaskDeleteConfirmModal, TaskCompleteCoinModal 임포트
import TaskEditModal from './TaskEditModal';
import TaskDeleteConfirmModal from './TaskDeleteConfirmModal';
import TaskCompleteCoinModal from './TaskCompleteCoinModal';
import AlbumPhotoPromptModal from './AlbumPhotoPromptModal';

const TaskDetailModal = ({ selectedDate, tasks, onClose, onTaskUpdate }) => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editMode, setEditMode] = useState('add'); // 'add' 또는 'edit'
  const [currentEditingTask, setCurrentEditingTask] = useState(null); // 수정 중인 Task

  const [isDeleteConfirmModalVisible, setIsDeleteConfirmModalVisible] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null); // 삭제할 Task
  
  const [isCoinModalVisible, setIsCoinModalVisible] = useState(false);
  const [completedTask, setCompletedTask] = useState(null); // 완료된 Task

  const [isAlbumPromptVisible, setIsAlbumPromptVisible] = useState(false); // 성장앨범 안내 모달

  // Task 완료 체크 토글
  const toggleTaskCompletion = (id) => {
    const task = tasks.find(t => t.id === id);
    if (task && !task.completed) {
      setCompletedTask(task);
      
      // 백엔드 업데이트 (현재는 부모 컴포넌트의 state 업데이트)
      if (onTaskUpdate) {
        onTaskUpdate(id, { completed: true });
      }
      
      // 성장앨범 연동이 체크되어 있으면 사진 촬영 모달 먼저 표시
      if (task.isAlbumLinked) {
        showPhotoModal(task);
      } else {
        // 일반 Task 완료 시 코인 모달 표시
        showCoinModal(task);
      }
    }
  };

  const showCoinModal = (task) => {
    setCompletedTask(task);
    setIsCoinModalVisible(true);
  };

  const showPhotoModal = (task) => {
    // 성장앨범 안내 모달 표시
    setIsAlbumPromptVisible(true);
  };

  const handlePhotoSave = (photoData) => {
    // 사진 저장 후 모달 닫고 코인 모달 표시
    setIsAlbumPromptVisible(false);
    // 여기서 photoData를 백엔드에 저장
    console.log('Photo saved:', photoData);
    showCoinModal(completedTask);
  };

  // Task 추가 버튼 클릭
  const handleAddTask = () => {
    setEditMode('add');
    setCurrentEditingTask(null);
    setIsEditModalVisible(true);
  };

  // Task 수정 아이콘 클릭
  const handleEditTask = (task) => {
    setEditMode('edit');
    setCurrentEditingTask(task);
    setIsEditModalVisible(true);
  };

  // Task 삭제 아이콘 클릭
  const handleDeleteTask = (task) => {
    setTaskToDelete(task);
    setIsDeleteConfirmModalVisible(true);
  };

  // Task 삭제 확인 모달에서 '예' 클릭 시
  const onConfirmDelete = (deleteFutureTasks) => {
    if (deleteFutureTasks) {
      Alert.alert('삭제 완료', `"${taskToDelete.text}"와 미래 예정된 모든 반복 Task가 삭제되었습니다.`);
    } else {
      Alert.alert('삭제 완료', `"${taskToDelete.text}"가 삭제되었습니다.`);
    }
    // 실제로는 백엔드에서 Task 삭제
    setIsDeleteConfirmModalVisible(false);
    setTaskToDelete(null);
    onClose(); // 모달 닫기
  };

  // Task 삭제 확인 모달에서 '아니오' 클릭 시
  const onCancelDelete = () => {
    setIsDeleteConfirmModalVisible(false);
    setTaskToDelete(null);
  };

  // TaskEditModal에서 저장 완료 시
  const onTaskEditSave = (updatedTask) => {
    Alert.alert('Task', t('task.saved', { mode: t(editMode === 'add' ? 'task.saved_mode_add' : 'task.saved_mode_edit') }));
    setIsEditModalVisible(false);
    // 실제로는 백엔드 업데이트 및 Task 목록 갱신
    onClose(); // 모달 닫기
  };

  // 스와이프 가능한 Task 항목 컴포넌트
  const SwipeableTaskItem = ({ item }) => {
    const translateX = new Animated.Value(0);
    const [isSwipeOpen, setIsSwipeOpen] = useState(false);

    const onGestureEvent = Animated.event(
      [{ nativeEvent: { translationX: translateX } }],
      { useNativeDriver: true }
    );

    const onHandlerStateChange = (event) => {
      if (event.nativeEvent.state === State.END) {
        const { translationX } = event.nativeEvent;
        
        if (translationX < -100) {
          // 왼쪽으로 스와이프 - 액션 버튼 표시
          Animated.spring(translateX, {
            toValue: -120,
            useNativeDriver: true,
          }).start();
          setIsSwipeOpen(true);
        } else {
          // 원래 위치로 복귀
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
          setIsSwipeOpen(false);
        }
      }
    };

    const closeSwipe = () => {
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
      setIsSwipeOpen(false);
    };

    return (
      <View style={styles.swipeContainer}>
        {/* 액션 버튼들 (뒤쪽) */}
        <View style={styles.swipeActions}>
          <TouchableOpacity 
            style={[styles.swipeAction, styles.editAction]} 
            onPress={() => {
              closeSwipe();
              handleEditTask(item);
            }}
          >
            <FontAwesome5 name="pen" size={18} color={Colors.textLight} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.swipeAction, styles.deleteAction]} 
            onPress={() => {
              closeSwipe();
              handleDeleteTask(item);
            }}
          >
            <FontAwesome5 name="trash-alt" size={18} color={Colors.textLight} />
          </TouchableOpacity>
        </View>

        {/* Task 아이템 (앞쪽) */}
        <PanGestureHandler
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onHandlerStateChange}
        >
          <Animated.View 
            style={[
              styles.taskItem,
              { transform: [{ translateX }] }
            ]}
          >
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => toggleTaskCompletion(item.id)}
            >
              <Text style={item.completed ? styles.checkboxChecked : styles.checkboxUnchecked}>
                {item.completed ? '✔' : '☐'}
              </Text>
            </TouchableOpacity>
            <Text style={[styles.taskText, item.completed && styles.taskTextCompleted]}>
              {item.text}
            </Text>
            {item.category && (
              <View style={[styles.categoryTag, { backgroundColor: item.color || Colors.primaryBeige }]}>
                <Text style={styles.categoryText}>{item.category}</Text>
              </View>
            )}
          </Animated.View>
        </PanGestureHandler>
      </View>
    );
  };

  // Task 항목 렌더링
  const renderTaskItem = ({ item }) => <SwipeableTaskItem item={item} />;

  return (
    <View style={styles.overlay}>
      <View style={styles.modalContent}>
        {/* 날짜 표시 */}
        <Text style={styles.modalDate}>
          {format(new Date(selectedDate), 'M월 d일 (E)', { locale: ko })}
        </Text>

        {/* 스크롤 가능한 Task 목록 */}
        <View style={{ flex: 1 }}>
          {tasks.length > 0 ? (
            <FlatList
              data={tasks}
              renderItem={renderTaskItem}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.taskListContent}
            />
          ) : (
            <View style={styles.noTaskContainer}>
              <Text style={styles.noTaskText}>{t('task.no_tasks')}</Text>
            </View>
          )}
        </View>

        {/* 할 일 추가 버튼 */}
        <TouchableOpacity style={styles.addTaskButton} onPress={handleAddTask}>
          <Text style={styles.addTaskButtonText}>+ {t('task.add_task_button')}</Text>
        </TouchableOpacity>
      </View>

      {/* Task 추가/수정 모달 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isEditModalVisible}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <TaskEditModal
          mode={editMode}
          initialTask={currentEditingTask}
          onSave={onTaskEditSave}
          onClose={() => setIsEditModalVisible(false)}
        />
      </Modal>

      {/* Task 삭제 확인 모달 */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isDeleteConfirmModalVisible}
        onRequestClose={onCancelDelete}
      >
        <TaskDeleteConfirmModal
          task={taskToDelete}
          onConfirm={onConfirmDelete}
          onCancel={onCancelDelete}
        />
      </Modal>

      {/* Task 완료 코인 모달 */}
      <TaskCompleteCoinModal
        isVisible={isCoinModalVisible}
        onClose={() => {
          setIsCoinModalVisible(false);
          setCompletedTask(null);
        }}
        taskText={completedTask?.text}
        earnedCoins={10}
      />

      {/* 성장앨범 안내 모달 */}
      <AlbumPhotoPromptModal
        visible={isAlbumPromptVisible}
        onClose={() => setIsAlbumPromptVisible(false)}
        onSave={handlePhotoSave}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.primaryBeige,
    borderRadius: 20,
    padding: 30,
    width: '90%',
    minHeight: '60%',
    maxHeight: '80%',
    borderWidth: 1.5,
    borderColor: 'rgba(150, 150, 150, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalDate: {
    fontSize: 20,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 30,
    textAlign: 'left',
  },
  taskListContent: {
    paddingBottom: 10,
  },
  swipeContainer: {
    marginBottom: 10,
    overflow: 'hidden',
    borderRadius: 10,
  },
  swipeActions: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    width: 120,
  },
  swipeAction: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAction: {
    backgroundColor: Colors.accentApricot,
  },
  deleteAction: {
    backgroundColor: '#FF6B6B',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryBeige,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    position: 'relative', // 카테고리 태그 위치 조정을 위해
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: Colors.secondaryBrown,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    backgroundColor: Colors.textLight,
  },
  checkboxChecked: {
    color: Colors.accentApricot,
    fontSize: 18,
  },
  checkboxUnchecked: {
    color: 'transparent',
    fontSize: 18,
  },
  taskText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    flex: 1,
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    color: Colors.secondaryBrown,
  },
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  actionIcon: {
    padding: 5,
    marginLeft: 10,
  },
  categoryTag: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  categoryText: {
    fontSize: FontSizes.small - 2, // 더 작은 글씨
    color: Colors.textLight,
    fontWeight: FontWeights.medium,
  },
  noTaskContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  noTaskText: {
    fontSize: FontSizes.medium,
    color: Colors.secondaryBrown,
  },
  addTaskButton: {
    backgroundColor: '#FFFCF5',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0)',
  },
  addTaskButtonText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    fontWeight: FontWeights.medium,
  },
});

export default TaskDetailModal;
