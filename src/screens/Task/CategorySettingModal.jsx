// src/screens/Task/CategorySettingModal.jsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';

import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Header from '../../components/common/Header';
import { useTranslation } from 'react-i18next';

const CategorySettingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const [categories, setCategories] = useState([
    { name: '일상', color: '#C8B08F', id: 'cat1' },
    { name: '창업팀', color: '#F5E6CC', id: 'cat2' },
    { name: '8월 국제무역사', color: '#F4C16E', id: 'cat3' },
  ]);

  // ⚠️ 화면이 다시 포커스될 때, route.params의 변경을 감지하여 목록을 새로고침
  useEffect(() => {
    if (isFocused && route.params?.refresh) {
      const { newCategory, deletedCategoryId, updatedCategory } = route.params;

      if (newCategory) {
        setCategories(prev => [...prev, newCategory]);
      } else if (deletedCategoryId) {
        setCategories(prev => prev.filter(c => c.id !== deletedCategoryId));
      } else if (updatedCategory) {
        setCategories(prev => prev.map(c => c.id === updatedCategory.id ? updatedCategory : c));
      }

      // 처리 후 파라미터를 초기화하여 중복 실행 방지
      navigation.setParams({ 
        refresh: false, 
        newCategory: null, 
        deletedCategoryId: null, 
        updatedCategory: null 
      });
    }
  }, [isFocused, route.params, navigation]);


  const handleEditCategory = (category) => {
    navigation.navigate('CategoryEdit', { category });
  };
  
  const handleAddCategory = () => {
    navigation.navigate('CategoryEdit', { category: null });
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleEditCategory(item)} style={styles.categoryItem}>
      <View style={[styles.categoryColorBox, { backgroundColor: item.color }]} />
      <Text style={styles.categoryName}>{item.name}</Text>
      <View style={styles.dragIcon}>
        <FontAwesome5 name="bars" size={20} color={Colors.secondaryBrown} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top }]}>
      <Header title={'TASK'} showBackButton={true} />
      <View style={styles.content}>
        <View style={styles.listContainer}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>{t('task.categories_title')}</Text>
            <TouchableOpacity style={styles.addButton} onPress={handleAddCategory}>
              <FontAwesome5 name="plus" size={20} color={Colors.textDark} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={item => item.id}
          />
        </View>
      </View>
    </View>
  );
};

// ⚠️ 시안과 동일하게 스타일 수정
const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: Colors.primaryBeige },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  listContainer: {
    backgroundColor: Colors.textLight,
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    marginBottom: 10,
  },
  listTitle: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
  },
  addButton: {
    padding: 5,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  categoryColorBox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    marginRight: 15,
  },
  categoryName: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    flex: 1,
  },
  dragIcon: {
    paddingLeft: 10,
  },
});

export default CategorySettingScreen;