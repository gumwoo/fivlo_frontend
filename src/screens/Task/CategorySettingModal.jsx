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
  
  // ⚠️ 화면이 다시 포커스될 때, 'refresh' 파라미터가 있으면 목록을 새로고침하는 로직
  useEffect(() => {
    if (isFocused && route.params?.refresh) {
      // 실제 앱에서는 여기서 백엔드 API를 다시 호출하여 최신 데이터를 가져옵니다.
      // 지금은 임시로 새로운 아이템을 추가하여 테스트합니다.
      const newCategory = { 
        name: route.params.newCategory?.name || `새 항목 ${Math.floor(Math.random() * 100)}`,
        color: route.params.newCategory?.color || '#A0FFC3',
        id: `cat${Date.now()}` 
      };
      setCategories(prev => [...prev, newCategory]);

      // refresh 파라미터를 다시 false로 바꿔서 중복 실행을 방지합니다.
      navigation.setParams({ refresh: false, newCategory: null });
    }
  }, [isFocused, route.params?.refresh]);


  const handleEditCategory = (category) => {
    navigation.navigate('CategoryEdit', { category });
  };
  
  const handleAddCategory = () => {
    navigation.navigate('CategoryEdit', { category: null });
  };

  const renderCategoryItem = ({ item }) => (
    <View style={styles.categoryItem}>
      <View style={[styles.categoryColorBox, { backgroundColor: item.color }]} />
      <Text style={styles.categoryName}>{item.name}</Text>
      <TouchableOpacity onPress={() => handleEditCategory(item)} style={styles.dragIcon}>
        <FontAwesome5 name="bars" size={20} color={Colors.secondaryBrown} />
      </TouchableOpacity>
    </View>
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

const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: Colors.primaryBeige },
  content: { flex: 1, padding: 20 },
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
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
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