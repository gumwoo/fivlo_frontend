// src/screens/PremiumMembershipScreen.jsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Header from '../components/common/Header';
import { Colors } from '../styles/color';
import { FontSizes, FontWeights } from '../styles/Fonts';
import PremiumPreparingModal from '../components/common/PremiumPreparingModal';

const PremiumMembershipScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [showPreparingModal, setShowPreparingModal] = useState(false);

  const handlePurchaseAttempt = (plan) => {
    // 결제 시도 시 준비중 모달 표시
    setShowPreparingModal(true);
  };

  const handleCloseModal = () => {
    setShowPreparingModal(false);
  };

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top }]}>
      <Header title={t('premium.title')} showBackButton={true} />
      
      <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
        {/* 오분이 캐릭터 */}
        <View style={styles.characterContainer}>
          <Image 
            source={require('../../assets/images/오분이_노랑티셔츠_착용.png')}
            style={styles.characterImage}
            resizeMode="contain"
          />
        </View>

        {/* 메인 메시지 */}
        <Text style={styles.mainMessage}>
          {t('premium.main_message')}
        </Text>

        {/* 가격 옵션 */}
        <View style={styles.pricingContainer}>
          <TouchableOpacity 
            style={styles.pricingOption}
            onPress={() => handlePurchaseAttempt('monthly')}
          >
            <Text style={styles.priceText}>3,900원</Text>
            <Text style={styles.periodText}>{t('premium.one_month')}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.pricingOption}
            onPress={() => handlePurchaseAttempt('yearly')}
          >
            <Text style={styles.priceText}>23,400원</Text>
            <Text style={styles.periodText}>{t('premium.twelve_months')}</Text>
          </TouchableOpacity>
        </View>

        {/* 사용 가능 기능 */}
        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>
            {t('premium.available_features')}
          </Text>
          
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Text style={styles.featureBullet}>•</Text>
              <Text style={styles.featureText}>
                {t('premium.feature_gps')}
              </Text>
            </View>
            
            <View style={styles.featureItem}>
              <Text style={styles.featureBullet}>•</Text>
              <Text style={styles.featureText}>
                {t('premium.feature_dday')}
              </Text>
            </View>
            
            <View style={styles.featureItem}>
              <Text style={styles.featureBullet}>•</Text>
              <Text style={styles.featureText}>
                {t('premium.feature_ai')}
              </Text>
            </View>
            
            <View style={styles.featureItem}>
              <Text style={styles.featureBullet}>•</Text>
              <Text style={styles.featureText}>
                {t('premium.feature_customization')}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* 준비중 모달 */}
      <PremiumPreparingModal
        visible={showPreparingModal}
        onClose={handleCloseModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.primaryBeige,
  },
  scrollViewContentContainer: {
    padding: 20,
    alignItems: 'center',
  },
  characterContainer: {
    marginVertical: 30,
    alignItems: 'center',
  },
  characterImage: {
    width: 200,
    height: 200,
  },
  mainMessage: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 28,
  },
  pricingContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    gap: 15,
  },
  pricingOption: {
    flex: 1,
    backgroundColor: Colors.textLight,
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.accentApricot,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  priceText: {
    fontSize: FontSizes.xlarge,
    fontWeight: FontWeights.bold,
    color: Colors.accentApricot,
    marginBottom: 5,
  },
  periodText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    fontWeight: FontWeights.medium,
  },
  featuresContainer: {
    width: '100%',
    backgroundColor: Colors.textLight,
    borderRadius: 15,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  featuresTitle: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 20,
    textAlign: 'center',
  },
  featuresList: {
    gap: 15,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  featureBullet: {
    fontSize: FontSizes.medium,
    color: Colors.accentApricot,
    marginRight: 10,
    marginTop: 2,
  },
  featureText: {
    flex: 1,
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    lineHeight: 22,
  },
});

export default PremiumMembershipScreen;
