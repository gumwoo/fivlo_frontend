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
export let mockOwnedItems = [];

export const shopItemsData = [
  { id: 'clothes1', type: 'top', name: '옷1', image: require('../../../assets/images/옷1.png'), price: 30, wornImage: require('../../../assets/images/오분이몸_옷1.png') },
  { id: 'clothes2', type: 'top', name: '옷2', image: require('../../../assets/images/옷2.png'), price: 30, wornImage: require('../../../assets/images/오분이몸_옷2.png') },
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
      
      navigation.navigate('ObooniCustomization', { purchasedItem: selectedItem });
      setIsPurchaseConfirmModalVisible(false);
    } else {
      Alert.alert(t('obooni.not_enough_coins'), t('obooni.not_enough_coins_message'));
      setIsPurchaseConfirmModalVisible(false);
    }
  };
  
  const getItemName = (itemId) => {
    const item = shopItemsData.find(i => i.id === itemId);
    return item?.name || itemId;
  };
    

  const renderShopItem = ({ item }) => {
    const canAfford = userCoins >= item.price;
    const isOwned = mockOwnedItems.includes(item.id);
  
    return (
      <TouchableOpacity
        style={styles.shopItemContainer}
        onPress={() => handlePurchaseAttempt(item)}
        disabled={isOwned}
      >
        <Image source={item.image} style={styles.shopItemImage} />
        <Text style={styles.shopItemName}>{getItemName(item.id)}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.shopItemPrice}>{item.price}</Text>
          <FontAwesome5 name="coins" size={FontSizes.small} color={Colors.accentApricot} style={styles.coinIcon} />
        </View>
        {isOwned && (
          <View style={styles.ownedOverlay}>
            <FontAwesome5 name="check-circle" size={30} color={Colors.accentApricot} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top }]}>
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
