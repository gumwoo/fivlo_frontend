// src/screens/Task/CategoryEditModal.jsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';

import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Header from '../../components/common/Header';
import { useTranslation } from 'react-i18next';

const NEW_COLOR_PALETTE = [
  '#000000', '#D0C8B9', '#A89987', '#806F5D', '#584C3E',
  '#F5E6CC', '#F4C16E', '#F19F47', '#E3A1A0', '#D66565',
  '#E6F5E3', '#BBE3B8', '#99D194', '#C9EAF0', '#A8D8E3',
  '#DAD3EC', '#A999D4', '#B97FC9', '#8DB3E2', '#5989C8',
];

const CategoryEditScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const initialCategory = route.params?.category;
  const mode = initialCategory ? 'edit' : 'add';

  const [categoryName, setCategoryName] = useState(initialCategory?.name || '');
  const [selectedColor, setSelectedColor] = useState(initialCategory?.color || NEW_COLOR_PALETTE[0]);

  const handleSave = () => {
    if (!categoryName.trim()) {
      Alert.alert(t('reminder.location_required_title'), '카테고리 내용을 입력해주세요.');
      return;
    }
    const newCategoryData = { name: categoryName, color: selectedColor };
    // ... 실제 저장 API 호출 로직 ...

    // ⚠️ 저장 후, 이전 화면으로 돌아가면서 'refresh' 신호와 새 카테고리 정보를 보냅니다.
    navigation.navigate('CategorySetting', { 
      refresh: true,
      newCategory: newCategoryData,
    });
  };

  const handleDelete = () => {
    Alert.alert('삭제 확인', '정말 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      { 
        text: '삭제', 
        style: 'destructive', 
        // ⚠️ 삭제 후에도 이전 화면에 새로고침 신호를 보냅니다.
        onPress: () => navigation.navigate('CategorySetting', { refresh: true })
      },
    ]);
  };

  const renderColorItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.colorOption, { backgroundColor: item }]}
      onPress={() => setSelectedColor(item)}
    >
      {selectedColor === item && (
        <FontAwesome5 name="check" size={18} color={Colors.textLight} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top }]}>
      <Header title={'TASK'} showBackButton={true} />
      <View style={styles.content}>
        <View style={styles.cardContainer}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{t('task.category_input_label')}</Text>
            {mode === 'edit' && (
              <TouchableOpacity onPress={handleDelete}>
                <Text style={styles.deleteButtonText}>삭제</Text>
              </TouchableOpacity>
            )}
          </View>
          <TextInput
            style={styles.input}
            placeholder="내용을 입력해주세요."
            placeholderTextColor={Colors.secondaryBrown}
            value={categoryName}
            onChangeText={setCategoryName}
          />
          <Text style={styles.label}>{t('task.color_select')}</Text>
          <FlatList
            data={NEW_COLOR_PALETTE}
            renderItem={renderColorItem}
            keyExtractor={item => item}
            numColumns={5}
            contentContainerStyle={styles.colorGrid}
          />
        </View>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>{t('task.save')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: Colors.primaryBeige },
  content: { flex: 1, padding: 20 },
  cardContainer: {
    backgroundColor: Colors.textLight,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: FontSizes.medium,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
  },
  deleteButtonText: { color: 'red', fontSize: FontSizes.medium, fontWeight: '600' },
  input: {
    backgroundColor: Colors.primaryBeige,
    borderRadius: 10,
    padding: 15,
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  label: { fontSize: FontSizes.medium, fontWeight: FontWeights.bold, color: Colors.textDark, marginTop: 25, marginBottom: 10 },
  colorGrid: {
    alignItems: 'center'
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 8,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
    backgroundColor: Colors.primaryBeige,
  },
  saveButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
  },
});

export default CategoryEditScreen;