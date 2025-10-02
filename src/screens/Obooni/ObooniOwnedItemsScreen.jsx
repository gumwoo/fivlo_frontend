// src/screens/Obooni/ObooniOwnedItemsScreen.jsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// 공통 스타일 및 컴포넌트 임포트
import { GlobalStyles } from '../../styles/GlobalStyles';
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Header from '../../components/common/Header';
import { useTranslation } from 'react-i18next';

// ObooniShopScreen에서 shopItemsData와 mockOwnedItems를 임포트
import { mockOwnedItems as globalMockOwnedItems, shopItemsData } from './ObooniShopScreen';

const ObooniOwnedItemsScreen = ({ isPremiumUser }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  // ObooniClosetScreen에서 전달받은 ownedItems (Mock 데이터)
  // 이제 globalMockOwnedItems를 기반으로 필터링하여 초기화합니다.
  const [ownedItems, setOwnedItems] = useState(
    shopItemsData.filter(item => globalMockOwnedItems.includes(item.id))
  );

  // 실제 앱에서는 이 화면이 포커스될 때마다 백엔드에서 최신 소유 아이템 목록을 가져와야 합니다.
  useEffect(() => {
    // 현재는 초기화 시 필터링된 데이터를 사용하지만,
    // 실제로는 API 호출: const fetchedOwnedItems = await fetchUserOwnedItems(currentUserId);
    // setOwnedItems(fetchedOwnedItems);
    // globalMockOwnedItems가 변경될 때마다 업데이트 (Mock 데이터 테스트용)
    setOwnedItems(shopItemsData.filter(item => globalMockOwnedItems.includes(item.id)));
  }, [globalMockOwnedItems]); // globalMockOwnedItems가 변경될 때마다 useEffect 실행

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer}>
      <Image source={item.image} style={styles.itemImage} />
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemType}>{item.type}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top + 20 }]}>
      <Header title={t('obooni.owned_header')} showBackButton={true} />
      
      {ownedItems.length > 0 ? (
        <FlatList
          data={ownedItems}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          numColumns={3}
          contentContainerStyle={styles.itemListContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{t('obooni.owned_empty')}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.primaryBeige,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FontSizes.medium,
    color: Colors.secondaryBrown,
  },
  itemListContainer: {
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  itemContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.textLight,
    borderRadius: 15,
    margin: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  itemName: {
    fontSize: FontSizes.medium,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    textAlign: 'center',
  },
  itemType: {
    fontSize: FontSizes.small,
    color: Colors.secondaryBrown,
    marginTop: 5,
  },
});

export default ObooniOwnedItemsScreen;
