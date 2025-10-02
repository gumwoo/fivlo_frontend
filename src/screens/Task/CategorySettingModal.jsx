// src/screens/CategorySettingModal.jsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';

// 공통 스타일 및 컴포넌트 임포트
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Button from '../../components/common/Button';
import { useTranslation } from 'react-i18next';

// CategoryEditModal 임포트 (아직 생성 안 했지만 미리 선언)
import CategoryEditModal from './CategoryEditModal';

const CategorySettingModal = ({ onSave, onClose }) => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editMode, setEditMode] = useState('add'); // 'add' 또는 'edit'
  const [currentEditingCategory, setCurrentEditingCategory] = useState(null);

  // 임시 카테고리 목록 (실제로는 백엔드에서 가져옴)
  const [categories, setCategories] = useState([
    { name: '일상', color: Colors.primaryBeige, id: 'cat1' },
    { name: '운동', color: '#FFABAB', id: 'cat2' },
    { name: '공부', color: '#99DDFF', id: 'cat3' },
    { name: '취미', color: '#A0FFC3', id: 'cat4' },
    { name: '업무', color: '#D1B5FF', id: 'cat5' },
  ]);

  // 카테고리 수정 아이콘 클릭
  const handleEditCategory = (category) => {
    setEditMode('edit');
    setCurrentEditingCategory(category);
    setIsEditModalVisible(true);
  };

  // 새 카테고리 추가 버튼 클릭
  const handleAddCategory = () => {
    setEditMode('add');
    setCurrentEditingCategory(null);
    setIsEditModalVisible(true);
  };

  // CategoryEditModal에서 저장 완료 시
  const onCategoryEditSave = (updatedCategory) => {
    if (mode === 'add') {
      setCategories(prev => [...prev, { ...updatedCategory, id: Date.now().toString() }]);
    } else {
      setCategories(prev => prev.map(cat => cat.id === updatedCategory.id ? updatedCategory : cat));
    }
    setIsEditModalVisible(false);
    // 실제로는 백엔드 업데이트
    Alert.alert(t('reminder.saved_title'), t('task.saved', { mode: t(mode === 'add' ? 'task.saved_mode_add' : 'task.saved_mode_edit') }));
  };

  // 카테고리 항목 렌더링
  const renderCategoryItem = ({ item }) => (
    <View style={styles.categoryItem}>
      <View style={[styles.categoryColorBox, { backgroundColor: item.color }]} />
      <Text style={styles.categoryName}>{item.name}</Text>
      <TouchableOpacity onPress={() => handleEditCategory(item)} style={styles.editIcon}>
        <FontAwesome5 name="pen" size={18} color={Colors.secondaryBrown} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.overlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>{t('task.categories_title')}</Text>

        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.categoryListContent}
        />

        <Button title={t('task.categories_add')} onPress={handleAddCategory} style={styles.addButton} />
        <Button title={t('task.categories_close')} onPress={onClose} primary={false} style={styles.closeButton} />
      </View>

      {/* 카테고리 추가/수정 모달 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isEditModalVisible}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <CategoryEditModal
          mode={editMode}
          initialCategory={currentEditingCategory}
          onSave={onCategoryEditSave}
          onClose={() => setIsEditModalVisible(false)}
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
    maxHeight: '80%',
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
  categoryListContent: {
    flexGrow: 1,
    width: '100%',
    paddingBottom: 10,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryBeige,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryColorBox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 15,
    borderWidth: 1,
    borderColor: Colors.secondaryBrown,
  },
  categoryName: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    flex: 1,
  },
  editIcon: {
    padding: 5,
  },
  addButton: {
    marginTop: 20,
    width: '100%',
  },
  closeButton: {
    marginTop: 10,
    width: '100%',
  },
});

export default CategorySettingModal;
