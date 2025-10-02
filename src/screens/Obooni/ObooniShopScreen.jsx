// src/screens/Obooni/ObooniShopScreen.jsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert, Modal } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';

// 공통 스타일 및 컴포넌트 임포트
import { GlobalStyles } from '../../styles/GlobalStyles';
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import { useTranslation } from 'react-i18next';

// 임시 사용자 데이터 (코인 및 소유 아이템) - 실제로는 백엔드/전역 상태에서 가져옴
export let mockUserCoins = 500;
export let mockOwnedItems = [
  'shop1',
  'shop3',
];

export const shopItemsData = [
  { id: 'shop1', type: 'top', name: '노란색 티셔츠', image: require('../../../assets/images/obooni_item_yellow_tshirt.png'), price: 100 },
  { id: 'shop2', type: 'bottom', name: '청바지', image: require('../../../assets/images/obooni_item_jeans.png'), price: 150 },
  { id: 'shop3', type: 'acc', name: '안경', image: require('../../../assets/images/obooni_item_glasses.png'), price: 50 },
  { id: 'shop4', type: 'top', name: '초록색 셔츠', image: require('../../../assets/images/obooni_item_green_shirt.png'), price: 120 },
  { id: 'shop5', type: 'top', name: '빨간색 패딩', image: require('../../../assets/images/obooni_item_red_padding.png'), price: 200 },
  { id: 'shop6', type: 'bottom', name: '베이지색 치마', image: require('../../../assets/images/obooni_item_beige_skirt.png'), price: 130 },
  { id: 'shop7', type: 'top', name: '파란색 멜빵', image: require('../../../assets/images/obooni_item_blue_overall.png'), price: 180 },
  { id: 'shop8', type: 'acc', name: '모자', image: require('../../../assets/images/obooni_item_hat.png'), price: 70 },
];


const ObooniShopScreen = ({ isPremiumUser }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const { t } = useTranslation();

  const [userCoins, setUserCoins] = useState(mockUserCoins);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isPurchaseConfirmModalVisible, setIsPurchaseConfirmModalVisible] = useState(false);

  useEffect(() => {
    if (isFocused) {
      setUserCoins(mockUserCoins);
    }
  }, [isFocused]);

  const handlePurchaseAttempt = (item) => {
    if (!isPremiumUser) {
      navigation.navigate('PremiumMembership');
      return;
    }

    if (mockOwnedItems.includes(item.id)) {
      Alert.alert(t('reminder.location_required_title'), t('obooni.already_owned'));
      return;
    }
    setSelectedItem(item);
    setIsPurchaseConfirmModalVisible(true);
  };

  const confirmPurchase = () => {
    if (!selectedItem) return;

    if (userCoins >= selectedItem.price) {
      mockUserCoins -= selectedItem.price;
      mockOwnedItems.push(selectedItem.id);

      setUserCoins(mockUserCoins);
      Alert.alert(t('obooni.purchase_complete'), t('obooni.purchase_complete_message', { name: getItemName(selectedItem.id) }));
      
      navigation.replace('ObooniCloset', { purchasedItem: selectedItem });
      setIsPurchaseConfirmModalVisible(false);
    } else {
      Alert.alert(t('obooni.not_enough_coins'), t('obooni.not_enough_coins_message'));
      setIsPurchaseConfirmModalVisible(false);
    }
  };

  const getItemName = (itemId) => {
    const itemNames = {
      'shop1': t('obooni_shop.items.yellow_tshirt'),
      'shop2': t('obooni_shop.items.jeans'),
      'shop3': t('obooni_shop.items.glasses'),
      'shop4': t('obooni_shop.items.green_shirt'),
      'shop5': t('obooni_shop.items.red_padding'),
      'shop6': t('obooni_shop.items.beige_skirt'),
      'shop7': t('obooni_shop.items.blue_overall'),
      'shop8': t('obooni_shop.items.hat'),
    };
    return itemNames[itemId] || shopItemsData.find(item => item.id === itemId)?.name;
  };

  const renderShopItem = ({ item }) => {
    const canAfford = userCoins >= item.price;
    const isOwned = mockOwnedItems.includes(item.id);

    return (
      <TouchableOpacity
        style={styles.shopItemContainer}
        onPress={() => handlePurchaseAttempt(item)}
        disabled={isOwned || !isPremiumUser}
      >
        <Image source={item.image} style={styles.shopItemImage} />
        <Text style={styles.shopItemName}>{getItemName(item.id)}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.shopItemPrice}>{item.price}</Text>
          <FontAwesome5 name="coins" size={FontSizes.small} color={Colors.accentApricot} style={styles.coinIcon} />
        </View>
        {!isPremiumUser && (
          <View style={styles.lockOverlay}>
            <FontAwesome5 name="lock" size={30} color={Colors.textLight} />
          </View>
        )}
        {isOwned && (
          <View style={styles.ownedOverlay}>
            <FontAwesome5 name="check-circle" size={30} color={Colors.accentApricot} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top + 20 }]}>
      <Header title={t('obooni.shop_header')} showBackButton={true} />

      <View style={styles.userCoinDisplay}>
        <Text style={styles.userCoinText}>{t('obooni.coins', { amount: userCoins })}</Text>
        <FontAwesome5 name="coins" size={FontSizes.medium} color={Colors.accentApricot} />
      </View>

      <FlatList
        data={shopItemsData}
        renderItem={renderShopItem}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.shopItemList}
      />

      <Modal
        animationType="fade"
        transparent={true}
        visible={isPurchaseConfirmModalVisible}
        onRequestClose={() => setIsPurchaseConfirmModalVisible(false)}
      >
        <View style={styles.confirmModalOverlay}>
          <View style={styles.confirmModalContent}>
            <Text style={styles.confirmModalTitle}>{t('obooni.purchase_title')}</Text>
            {selectedItem && (
              <>
                <Image source={selectedItem.image} style={styles.confirmModalImage} />
                <Text style={styles.confirmModalText}>
                  {t('obooni.purchase_confirm', { name: getItemName(selectedItem.id), price: selectedItem.price })}
                </Text>
              </>
            )}
            <View style={styles.confirmModalButtons}>
              <Button title={t('obooni.cancel')} onPress={() => setIsPurchaseConfirmModalVisible(false)} primary={false} style={styles.confirmButton} />
              <Button title={t('obooni.buy')} onPress={confirmPurchase} style={styles.confirmButton} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.primaryBeige,
  },
  userCoinDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  userCoinText: {
    fontSize: FontSizes.medium,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginRight: 5,
  },
  shopItemList: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  shopItemContainer: {
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
    position: 'relative',
  },
  shopItemImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  shopItemName: {
    fontSize: FontSizes.medium,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: 5,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shopItemPrice: {
    fontSize: FontSizes.small,
    color: Colors.secondaryBrown,
    marginRight: 5,
  },
  coinIcon: {
    // FontAwesome5 코인 아이콘
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ownedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  confirmModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  confirmModalContent: {
    backgroundColor: Colors.textLight,
    borderRadius: 20,
    padding: 25,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  confirmModalTitle: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 20,
  },
  confirmModalImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 15,
  },
  confirmModalText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: 30,
  },
  confirmModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  confirmButton: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default ObooniShopScreen;
