// src/screens/TaskEditModal.jsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';

// 공통 스타일 및 컴포넌트 임포트
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Button from '../../components/common/Button';
import { useTranslation } from 'react-i18next';

// CategorySettingModal 임포트 (아직 생성 안 했지만 미리 선언)
import CategorySettingModal from './CategorySettingModal';

const TaskEditModal = ({ mode, initialTask, onSave, onClose }) => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [taskContent, setTaskContent] = useState(initialTask ? initialTask.text : '');
  const [selectedCategory, setSelectedCategory] = useState(initialTask ? initialTask.category : t('task_calendar.categories.daily')); // 기본 카테고리
  const [selectedCategoryColor, setSelectedCategoryColor] = useState(initialTask ? initialTask.color : Colors.primaryBeige); // 기본 카테고리 색상
  const [isDailyRepeat, setIsDailyRepeat] = useState(initialTask ? initialTask.isDailyRepeat : false);
  const [isAlbumLinked, setIsAlbumLinked] = useState(initialTask ? initialTask.isAlbumLinked : false);

  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);

  // 임시 카테고리 목록 (실제로는 백엔드에서 가져옴)
  const mockCategories = [
    { name: t('task_calendar.categories.daily'), color: Colors.primaryBeige },
    { name: t('task_calendar.categories.exercise'), color: '#FFABAB' },
    { name: t('task_calendar.categories.study'), color: '#99DDFF' },
    { name: t('task_calendar.categories.hobby'), color: '#A0FFC3' },
    { name: t('task_calendar.categories.work'), color: '#D1B5FF' },
  ];

  // 카테고리 선택 핸들러
  const handleCategorySelect = (categoryName, color) => {
    setSelectedCategory(categoryName);
    setSelectedCategoryColor(color);
  };

  // 카테고리 설정 모달에서 저장 완료 시
  const onCategorySave = (newCategory) => {
    // Alert.alert('카테고리 저장', `새 카테고리 "${newCategory.name}" 저장됨`);
    // mockCategories에 추가하거나 실제 백엔드에 저장
    setIsCategoryModalVisible(false);
    setSelectedCategory(newCategory.name);
    setSelectedCategoryColor(newCategory.color);
  };

  const handleSave = () => {
    if (!taskContent.trim()) {
      Alert.alert(t('reminder.location_required_title'), t('task.content_placeholder'));
      return;
    }
    const savedTask = {
      id: initialTask ? initialTask.id : Date.now().toString(),
      text: taskContent,
      category: selectedCategory,
      color: selectedCategoryColor,
      isDailyRepeat: isDailyRepeat,
      isAlbumLinked: isAlbumLinked,
      completed: initialTask ? initialTask.completed : false, // 추가 시에는 미완료
    };
    onSave(savedTask); // 부모 컴포넌트에 저장된 Task 전달
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>{mode === 'add' ? t('task.edit_add_title') : t('task.edit_edit_title')}</Text>

        {/* 내용 입력 칸 */}
        <TextInput
          style={styles.contentInput}
          placeholder={t('task.content_placeholder')}
          placeholderTextColor={Colors.secondaryBrown}
          value={taskContent}
          onChangeText={setTaskContent}
          multiline={true}
          numberOfLines={3}
          textAlignVertical="top"
        />

        {/* Task 카테고리 설정란 */}
        <Text style={styles.sectionTitle}>{t('task.category_setting')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScrollContainer}>
          {mockCategories.map((cat, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.categoryButton,
                { backgroundColor: cat.color },
                selectedCategory === cat.name && styles.categoryButtonActive
              ]}
              onPress={() => handleCategorySelect(cat.name, cat.color)}
            >
              <Text style={styles.categoryButtonText}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.addCategoryButton} onPress={() => setIsCategoryModalVisible(true)}>
            <FontAwesome5 name="plus" size={20} color={Colors.secondaryBrown} />
          </TouchableOpacity>
        </ScrollView>

        {/* 매일 반복 여부 */}
        <TouchableOpacity style={styles.checkboxContainer} onPress={() => setIsDailyRepeat(!isDailyRepeat)}>
          <FontAwesome5
            name={isDailyRepeat ? 'check-square' : 'square'}
            size={24}
            color={isDailyRepeat ? Colors.accentApricot : Colors.secondaryBrown}
          />
          <Text style={styles.checkboxLabel}>{t('task.daily_repeat')}</Text>
        </TouchableOpacity>

        {/* 성장앨범 연동 여부 */}
        <TouchableOpacity style={styles.checkboxContainer} onPress={() => setIsAlbumLinked(!isAlbumLinked)}>
          <FontAwesome5
            name={isAlbumLinked ? 'check-square' : 'square'}
            size={24}
            color={isAlbumLinked ? Colors.accentApricot : Colors.secondaryBrown}
          />
          <Text style={styles.checkboxLabel}>{t('task.album_link')}</Text>
        </TouchableOpacity>

        {/* 버튼들 */}
        <View style={styles.buttonContainer}>
          <Button title={t('task.cancel')} onPress={onClose} primary={false} style={styles.actionButton} />
          <Button title={t('task.save')} onPress={handleSave} style={styles.actionButton} />
        </View>
      </View>

      {/* 카테고리 설정 모달 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isCategoryModalVisible}
        onRequestClose={() => setIsCategoryModalVisible(false)}
      >
        <CategorySettingModal
          onSave={onCategorySave}
          onClose={() => setIsCategoryModalVisible(false)}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    backgroundColor: Colors.textLight,
    borderRadius: 20,
    padding: 25,
    width: '90%',
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 20,
    textAlign: 'center',
  },
  contentInput: {
    width: '100%',
    backgroundColor: Colors.primaryBeige,
    borderRadius: 10,
    padding: 15,
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.secondaryBrown,
  },
  sectionTitle: {
    fontSize: FontSizes.medium,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 10,
    width: '100%',
    textAlign: 'left',
  },
  categoryScrollContainer: {
    paddingVertical: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  categoryButton: {
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  categoryButtonActive: {
    borderColor: Colors.accentApricot, // 활성화 시 테두리
    borderWidth: 2,
  },
  categoryButtonText: {
    fontSize: FontSizes.small,
    color: Colors.textLight,
    fontWeight: FontWeights.medium,
  },
  addCategoryButton: {
    backgroundColor: Colors.primaryBeige,
    borderRadius: 15,
    padding: 8,
    borderWidth: 1,
    borderColor: Colors.secondaryBrown,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
  },
  checkboxLabel: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default TaskEditModal;
