// src/screens/ObooniCustomizationScreen.jsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// 공통 스타일 및 컴포넌트 임포트
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Button from '../../components/common/Button';
import Header from '../../components/common/Header';
import { useTranslation } from 'react-i18next';
import { mockOwnedItems, shopItemsData, mockObooniState } from './ObooniShopScreen';

const ObooniCustomizationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const { t } = useTranslation();

  const [selectedClothes, setSelectedClothes] = useState(null);
  const [ownedClothes, setOwnedClothes] = useState([]);

  useEffect(() => {
    if (isFocused) {
      // mockOwnedItems에서 실제 소유한 옷만 필터링
      const owned = shopItemsData.filter(item => mockOwnedItems.includes(item.id));
      setOwnedClothes(owned);
    }
  }, [isFocused]);

  const handleSelectClothes = (item) => {
    setSelectedClothes(item);
    // 전역 객체에도 저장하여 홈 화면에서 사용
    mockObooniState.selectedClothes = item;
  };

  const handleGoToShop = () => {
    navigation.navigate('ObooniShop');
  };

  // 현재 선택된 옷을 입은 오분이 이미지 또는 기본 이미지
  const getCurrentObooniImage = () => {
    if (selectedClothes && selectedClothes.wornImage) {
      return selectedClothes.wornImage;
    }
    return require('../../../assets/images/오분이몸.png');
  };

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top }]}>
      <Header title={t('obooni.customize_header')} showBackButton={true} />

      <View style={styles.contentContainer}>
        {/* 오분이 캐릭터 표시 */}
        <Text style={styles.sectionTitle}>{t('obooni.character_preview')}</Text>
        <Image source={getCurrentObooniImage()} style={styles.obooniImage} />

        {/* 옷장 섹션 */}
        <View style={styles.closetSection}>
          <View style={styles.closetHeader}>
            <Text style={styles.sectionTitle}>{t('obooni.closet_title')}</Text>
            <TouchableOpacity onPress={handleGoToShop} style={styles.addButton}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          {ownedClothes.length > 0 ? (
            <ScrollView 
              style={styles.clothesScrollView}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.clothesGrid}>
                {ownedClothes.map((item, index) => {
                  const isSelected = selectedClothes?.id === item.id;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.clothesItem,
                        isSelected && styles.clothesItemSelected,
                        index % 2 === 0 ? styles.clothesItemLeft : styles.clothesItemRight
                      ]}
                      onPress={() => handleSelectClothes(item)}
                    >
                      <Image source={item.image} style={styles.clothesItemImage} />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          ) : (
            <View style={styles.emptyCloset}>
              <Text style={styles.emptyText}>{t('obooni.empty_closet')}</Text>
              <Button title={t('obooni.go_to_shop')} onPress={handleGoToShop} style={styles.shopButton} />
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.primaryBeige,
  },
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginTop: 20,
    marginBottom: 15,
  },
  obooniImage: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  closetSection: {
    width: '100%',
    minHeight: 400, // 최소 높이
    maxHeight: 450, // 최대 높이
    backgroundColor: Colors.textLight,
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  closetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: Colors.secondaryBrown,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: FontSizes.extraLarge,
    color: Colors.textLight,
    fontWeight: FontWeights.bold,
  },
  clothesScrollView: {
    flex: 1,
  },
  clothesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  clothesItem: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: Colors.primaryBeige,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    marginBottom: 10,
  },
  clothesItemLeft: {
    marginRight: '2%',
  },
  clothesItemRight: {
    marginLeft: '2%',
  },
  clothesItemSelected: {
    borderColor: Colors.accentApricot,
    borderWidth: 3,
  },
  clothesItemImage: {
    width: '70%',
    height: '70%',
    resizeMode: 'contain',
  },
  emptyCloset: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyText: {
    fontSize: FontSizes.medium,
    color: Colors.secondaryBrown,
    marginBottom: 15,
    textAlign: 'center',
  },
  shopButton: {
    width: 200,
  },
});

export default ObooniCustomizationScreen;
