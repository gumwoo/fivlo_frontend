// src/screens/CategoryEditModal.jsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';

// 공통 스타일 및 컴포넌트 임포트
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Button from '../../components/common/Button';
import { useTranslation } from 'react-i18next';

// 포모도로 목표 색상 팔레트 (CategoryEditModal에서도 재사용)
const COLOR_PALETTE = [
  '#FFD1DC', '#FFABAB', '#FFC3A0', '#FFDD99', '#FFFFB5', '#D1FFB5', '#A0FFC3', '#ABFFFF',
  '#D1B5FF', '#FFB5FF', '#C3A0FF', '#99DDFF', '#B5FFFF', '#B5FFD1', '#A0FFAB', '#C3FFAB',
  '#E0BBE4', '#957DAD', '#D291BC', '#FFC72C',
];

const CategoryEditModal = ({ mode, initialCategory, onSave, onClose }) => {
  const { t } = useTranslation();
  const [categoryName, setCategoryName] = useState(initialCategory ? initialCategory.name : '');
  const [selectedColor, setSelectedColor] = useState(initialCategory ? initialCategory.color : COLOR_PALETTE[0]);

  const handleSave = () => {
    if (!categoryName.trim()) {
      Alert.alert(t('reminder.location_required_title'), t('task.category_input_placeholder'));
      return;
    }
    const savedCategory = {
      id: initialCategory ? initialCategory.id : Date.now().toString(),
      name: categoryName,
      color: selectedColor,
    };
    onSave(savedCategory);
  };

  const renderColorItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.colorOption, { backgroundColor: item }]}
      onPress={() => setSelectedColor(item)}
    >
      {selectedColor === item && (
        <FontAwesome5 name="check" size={20} color={Colors.textLight} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.overlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>{mode === 'add' ? t('task.category_add_title') : t('task.category_edit_title')}</Text>

        {/* 카테고리 내용 입력 */}
        <Text style={styles.sectionTitle}>{t('task.category_input_label')}</Text>
        <TextInput
          style={styles.categoryInput}
          placeholder={t('task.category_input_placeholder')}
          placeholderTextColor={Colors.secondaryBrown}
          value={categoryName}
          onChangeText={setCategoryName}
        />

        {/* 색상 선택 */}
        <Text style={styles.sectionTitle}>{t('task.color_select')}</Text>
        <FlatList
          data={COLOR_PALETTE}
          renderItem={renderColorItem}
          keyExtractor={item => item}
          numColumns={5}
          contentContainerStyle={styles.colorOptionsGrid}
        />

        <View style={styles.buttonContainer}>
          <Button title={t('task.cancel')} onPress={onClose} primary={false} style={styles.actionButton} />
          <Button title={t('task.save')} onPress={handleSave} style={styles.actionButton} />
        </View>
      </View>
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
  sectionTitle: {
    fontSize: FontSizes.medium,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 10,
    width: '100%',
    textAlign: 'left',
    marginTop: 15,
  },
  categoryInput: {
    width: '100%',
    backgroundColor: Colors.primaryBeige,
    borderRadius: 10,
    padding: 15,
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.secondaryBrown,
  },
  colorOptionsGrid: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    width: '100%',
  },
  colorOption: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    margin: 8,
    borderWidth: 2,
    borderColor: Colors.secondaryBrown,
    justifyContent: 'center',
    alignItems: 'center',
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

export default CategoryEditModal;
