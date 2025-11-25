import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
  FlatList,
  Animated,
  Pressable,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { FontAwesome5 } from '@expo/vector-icons';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import { useTranslation } from 'react-i18next';
import useAlbumStore from '../../store/albumStore';
import useTaskStore from '../../store/taskStore'; // ✅ 전역 상태 불러오기

import TaskEditModal from './TaskEditModal';
import TaskDeleteConfirmModal from './TaskDeleteConfirmModal';
import TaskCompleteCoinModal from './TaskCompleteCoinModal';
import AlbumPhotoPromptModal from './AlbumPhotoPromptModal';

const TaskDetailModal = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { t } = useTranslation();
  const addPhoto = useAlbumStore((state) => state.addPhoto);
  const addTask = useTaskStore((state) => state.addTask); // ✅ 추가
  const updateTask = useTaskStore((state) => state.updateTask); // ✅ 업데이트용

  const { selectedDate, tasks: initialTasks } = route.params;
  const [tasks, setTasks] = useState(initialTasks);

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editMode, setEditMode] = useState('add');
  const [currentEditingTask, setCurrentEditingTask] = useState(null);

  const [isDeleteConfirmModalVisible, setIsDeleteConfirmModalVisible] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const [isCoinModalVisible, setIsCoinModalVisible] = useState(false);
  const [completedTask, setCompletedTask] = useState(null);

  const [isAlbumPromptVisible, setIsAlbumPromptVisible] = useState(false);

  const closeModal = () => navigation.goBack();

  // ✅ Task 완료 토글
  const toggleTaskCompletion = (id) => {
    const task = tasks.find((t) => t.id === id);
    if (task && !task.completed) {
      setCompletedTask(task);

      updateTask(selectedDate, id, { completed: true }); // ✅ 전역 상태 업데이트
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: true } : t))
      );

      if (task.isAlbumLinked) {
        showPhotoModal(task);
      } else {
        showCoinModal(task);
      }
    }
  };

  const showCoinModal = (task) => {
    setCompletedTask(task);
    setIsCoinModalVisible(true);
  };

  const showPhotoModal = (task) => {
    setIsAlbumPromptVisible(true);
  };

  const handlePhotoSave = (photoData) => {
    setIsAlbumPromptVisible(false);

    if (completedTask) {
      const newPhoto = {
        id: `photo-${Date.now()}`,
        uri: photoData.uri,
        memo: photoData.memo || '',
        categoryKey: completedTask.categoryKey || 'daily',
        type: photoData.type || 'image',
      };
      addPhoto(selectedDate, newPhoto);
    }
    showCoinModal(completedTask);
  };

  const handleAddTask = () => {
    setEditMode('add');
    setCurrentEditingTask(null);
    setIsEditModalVisible(true);
  };

  const handleEditTask = (task) => {
    setEditMode('edit');
    setCurrentEditingTask(task);
    setIsEditModalVisible(true);
  };

  const handleDeleteTask = (task) => {
    setTaskToDelete(task);
    setIsDeleteConfirmModalVisible(true);
  };

  const onConfirmDelete = (deleteFutureTasks) => {
    Alert.alert('삭제 완료', `"${taskToDelete.text}"가 삭제되었습니다.`);
    setIsDeleteConfirmModalVisible(false);
    setTaskToDelete(null);
    closeModal();
  };

  const onCancelDelete = () => {
    setIsDeleteConfirmModalVisible(false);
    setTaskToDelete(null);
  };

  // ✅ Task 저장 시 전역 스토어에 추가
  const onTaskEditSave = (savedTask) => {
    addTask(selectedDate, savedTask); // ✅ 전역 상태에 추가
    Alert.alert(
      'Task',
      t('task.saved', {
        mode: t(editMode === 'add' ? 'task.saved_mode_add' : 'task.saved_mode_edit'),
      })
    );
    setIsEditModalVisible(false);
    closeModal();
  };

  // ✅ Swipeable Task item
  const SwipeableTaskItem = ({ item }) => {
    const swipeableRef = useRef(null);

    const renderRightActions = (progress, dragX) => {
      const trans = dragX.interpolate({
        inputRange: [-120, 0],
        outputRange: [0, 120],
        extrapolate: 'clamp',
      });

      return (
        <Animated.View style={[styles.swipeActions, { transform: [{ translateX: trans }] }]}>
          <TouchableOpacity
            style={[styles.swipeAction, styles.editAction]}
            onPress={() => {
              swipeableRef.current?.close();
              handleEditTask(item);
            }}
          >
            <FontAwesome5 name="pen" size={18} color={Colors.textLight} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.swipeAction, styles.deleteAction]}
            onPress={() => {
              swipeableRef.current?.close();
              handleDeleteTask(item);
            }}
          >
            <FontAwesome5 name="trash-alt" size={18} color={Colors.textLight} />
          </TouchableOpacity>
        </Animated.View>
      );
    };

    return (
      <View style={styles.swipeContainer}>
        <Swipeable ref={swipeableRef} renderRightActions={renderRightActions} overshootRight={false}>
          <View style={[styles.taskItem, { backgroundColor: item.color || Colors.textLight }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.taskText, item.completed && styles.taskTextCompleted]}>
                {item.text}
              </Text>
            </View>
            <TouchableOpacity style={styles.checkbox} onPress={() => toggleTaskCompletion(item.id)}>
              <Text style={item.completed ? styles.checkboxChecked : styles.checkboxUnchecked}>
                {item.completed ? '✔' : ''}
              </Text>
            </TouchableOpacity>
          </View>
        </Swipeable>
      </View>
    );
  };

  const renderTaskItem = ({ item }) => <SwipeableTaskItem item={item} />;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={true}          // 항상 보이도록 (navigation으로 제어됨)
      onRequestClose={closeModal}
      onDismiss={closeModal}  // ✅ 모달 닫힐 때 완전히 언마운트
    >
      <Pressable style={styles.overlay} onPress={closeModal}>
        <GestureHandlerRootView style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <Pressable style={styles.modalContent}>
            <Text style={styles.modalDate}>
              {format(new Date(selectedDate), 'M월 d일 (E)', { locale: ko })}
            </Text>

            <View style={{ flex: 1 }}>
              {tasks.length > 0 ? (
                <FlatList
                  data={tasks}
                  renderItem={renderTaskItem}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.taskListContent}
                />
              ) : (
                <View style={styles.noTaskContainer}>
                  <Text style={styles.noTaskText}>{t('task.no_tasks', '등록된 Task가 없습니다')}</Text>
                </View>
              )}
            </View>

            <TouchableOpacity style={styles.addTaskButton} onPress={handleAddTask}>
              <Text style={styles.addTaskButtonText}>+ {t('task.add_task_button', '새 Task 추가')}</Text>
            </TouchableOpacity>
          </Pressable>
        </GestureHandlerRootView>

        {/* 편집 모달 */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isEditModalVisible}
          onRequestClose={() => setIsEditModalVisible(false)}>
          <TaskEditModal
            mode={editMode}
            initialTask={currentEditingTask}
            onSave={onTaskEditSave}
            onClose={() => setIsEditModalVisible(false)}
          />
        </Modal>

        {/* 삭제 확인 모달 */}
        <Modal animationType="fade" transparent visible={isDeleteConfirmModalVisible} onRequestClose={onCancelDelete}>
          <TaskDeleteConfirmModal task={taskToDelete} onConfirm={onConfirmDelete} onCancel={onCancelDelete} />
        </Modal>

        {/* 코인 모달 */}
        <TaskCompleteCoinModal
          isVisible={isCoinModalVisible}
          onClose={() => {
            setIsCoinModalVisible(false);
            setCompletedTask(null);
          }}
          taskText={completedTask?.text}
          earnedCoins={10}
        />

        {/* 앨범 업로드 모달 */}
        <AlbumPhotoPromptModal
          visible={isAlbumPromptVisible}
          onClose={() => setIsAlbumPromptVisible(false)}
          onSave={handlePhotoSave}
        />
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
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
  taskListContent: { paddingBottom: 10 },
  swipeContainer: { marginBottom: 10, overflow: 'hidden', borderRadius: 10 },
  swipeActions: { flexDirection: 'row', alignItems: 'center', width: 120, justifyContent: 'flex-end' },
  swipeAction: { flex: 1, height: '100%', justifyContent: 'center', alignItems: 'center' },
  editAction: { backgroundColor: Colors.accentApricot },
  deleteAction: { backgroundColor: '#FF6B6B' },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.textLight,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: Colors.secondaryBrown,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
    backgroundColor: Colors.textLight,
  },
  checkboxChecked: { color: Colors.accentApricot, fontSize: 18, fontWeight: 'bold' },
  checkboxUnchecked: { color: 'transparent' },
  taskText: { fontSize: FontSizes.medium, color: Colors.textDark, flex: 1 },
  taskTextCompleted: { textDecorationLine: 'line-through', color: Colors.secondaryBrown },
  noTaskContainer: { justifyContent: 'center', alignItems: 'center', paddingVertical: 50 },
  noTaskText: { fontSize: FontSizes.medium, color: Colors.secondaryBrown },
  addTaskButton: {
    backgroundColor: '#FFFCF5',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0)',
  },
  addTaskButtonText: { fontSize: FontSizes.medium, color: Colors.textDark, fontWeight: FontWeights.medium },
});

export default TaskDetailModal;
