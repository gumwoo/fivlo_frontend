// src/screens/Obooni/ObooniClosetScreen.jsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, FlatList } from 'react-native';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';

// 공통 스타일 및 컴포넌트 임포트
import { GlobalStyles } from '../../styles/GlobalStyles';
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Header from '../../components/common/Header';
import CharacterImage from '../../components/common/CharacterImage';
import { useTranslation } from 'react-i18next';

// ObooniShopScreen에서 임시 데이터 임포트
import { mockOwnedItems as globalMockOwnedItems, shopItemsData } from './ObooniShopScreen';

const ObooniClosetScreen = ({ isPremiumUser }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const { t } = useTranslation();

  const [ownedItems, setOwnedItems] = useState([]);
  const [equippedItems, setEquippedItems] = useState({
    top: null,
    bottom: null,
    acc: null,
  });

  // 화면 포커스 시 소유 아이템 목록 업데이트
  useEffect(() => {
    if (isFocused) {
      const currentOwnedItems = shopItemsData.filter(item => globalMockOwnedItems.includes(item.id));
      setOwnedItems(currentOwnedItems);

      if (route.params?.purchasedItem) {
        const purchased = route.params.purchasedItem;
        setEquippedItems(prev => ({
          ...prev,
          [purchased.type]: purchased.id
        }));
        navigation.setParams({ purchasedItem: undefined });
      }
    }
  }, [isFocused, route.params?.purchasedItem]);

  const handleEquipItem = (item) => {
    setEquippedItems(prev => ({
      ...prev,
      [item.type]: prev[item.type] === item.id ? null : item.id
    }));
  };

  const handleGoToOwnedItems = () => {
    navigation.navigate('ObooniOwnedItems', { ownedItems: ownedItems });
  };

  const handleGoToShop = () => {
    navigation.navigate('ObooniShop');
  };

  const renderOwnedItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.itemThumbnailContainer, equippedItems[item.type] === item.id && styles.itemThumbnailActive]}
      onPress={() => handleEquipItem(item)}
    >
      <Image source={item.image} style={styles.itemThumbnail} />
    </TouchableOpacity>
  );

  const getObooniCharacterSource = () => {
    // 실제로는 CharacterImage 컴포넌트가 equippedItems를 props로 받아서
    // 여러 이미지 레이어를 조합하여 오분이를 렌더링해야 합니다.
    return require('../../../assets/images/오분이몸.png');
  };

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top + 20 }]}>
      <Header title={t('obooni.closet_header')} showBackButton={true} />

      <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
        <View style={styles.obooniPreviewContainer}>
          <Image source={getObooniCharacterSource()} style={styles.obooniPreviewImage} />
          {equippedItems.top && <Image source={ownedItems.find(i => i.id === equippedItems.top)?.image} style={styles.equippedItemOverlay} />}
          {equippedItems.bottom && <Image source={ownedItems.find(i => i.id === equippedItems.bottom)?.image} style={styles.equippedItemOverlay} />}
          {equippedItems.acc && <Image source={ownedItems.find(i => i.id === equippedItems.acc)?.image} style={styles.equippedItemOverlay} />}
        </View>

        <View style={styles.closetSection}>
          <View style={styles.closetHeader}>
            <TouchableOpacity onPress={handleGoToOwnedItems}>
              <Text style={styles.closetTitle}>{t('obooni.closet_title')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleGoToShop} style={styles.addShopButton}>
              <FontAwesome5 name="plus" size={20} color={Colors.secondaryBrown} />
            </TouchableOpacity>
          </View>
          
          {ownedItems.length > 0 ? (
            <FlatList
              data={ownedItems}
              renderItem={renderOwnedItem}
              keyExtractor={item => item.id}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.ownedItemsList}
            />
          ) : (
            <Text style={styles.emptyClosetText}>{t('obooni.closet_empty')}</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.primaryBeige,
  },
  scrollViewContentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
    paddingTop: 10,
  },
  obooniPreviewContainer: {
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  obooniPreviewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  equippedItemOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  closetSection: {
    width: '100%',
    backgroundColor: Colors.textLight,
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  closetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  closetTitle: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
  },
  addShopButton: {
    backgroundColor: Colors.primaryBeige,
    borderRadius: 15,
    padding: 8,
    borderWidth: 1,
    borderColor: Colors.secondaryBrown,
  },
  ownedItemsList: {
    paddingVertical: 10,
  },
  itemThumbnailContainer: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: Colors.primaryBeige,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  itemThumbnailActive: {
    borderColor: Colors.accentApricot,
  },
  itemThumbnail: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
  emptyClosetText: {
    fontSize: FontSizes.medium,
    color: Colors.secondaryBrown,
    textAlign: 'center',
    paddingVertical: 30,
  },
});

export default ObooniClosetScreen;
