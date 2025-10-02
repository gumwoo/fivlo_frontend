// src/screens/FeaturesScreen.jsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../components/common/Header';
import { GlobalStyles } from '../styles/GlobalStyles';
import { Colors } from '../styles/color';
import { FontSizes, FontWeights } from '../styles/Fonts';
import { useTranslation } from 'react-i18next';

const FeaturesScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const features = [
    { name: t('core.features.pomodoro'), image: require('../../assets/앱아이콘.png'), screen: 'Pomodoro' },
    { name: t('core.features.reminder'), image: require('../../assets/벨.png'), screen: 'Reminder' },
    { name: t('core.features.album'), image: require('../../assets/앨범.png'), screen: 'GrowthAlbumTab' },
    { name: t('core.features.time_attack'), image: require('../../assets/타임어택.png'), screen: 'TimeAttack' },
    { name: t('core.features.routine'), image: require('../../assets/테스크.png'), screen: 'RoutineSetting' },
    { name: t('core.features.analysis'), image: require('../../assets/그래프.png'), screen: 'AnalysisGraph' },
  ];

  const handleFeaturePress = (screenName) => {
    if (screenName === 'GrowthAlbumTab') {
      navigation.navigate('Main', { screen: screenName });
    } else {
      navigation.navigate(screenName);
    }
  };

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top }]}>
      <Header title={t('core.features_header')} showBackButton={true} />
      <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
        <View style={styles.featureGrid}>
          {features.map((feature, index) => (
            <TouchableOpacity
              key={index}
              style={styles.featureItem}
              onPress={() => handleFeaturePress(feature.screen)}
            >
              <Image source={feature.image} style={styles.featureImage} />
              <Text style={styles.featureText}>{feature.name}</Text>
            </TouchableOpacity>
          ))}
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
    paddingHorizontal: 30,
    // --- 수정: paddingTop 값을 늘려 버튼들을 아래로 내림 ---
    paddingTop: 50, 
    paddingBottom: 20,
    alignItems: 'center',
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
  },
  featureItem: {
    width: '45%',
    aspectRatio: 1,
    backgroundColor: Colors.textLight,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    margin: '2.5%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  featureText: {
    fontSize: FontSizes.medium,
    fontWeight: FontWeights.medium,
    color: Colors.textDark,
    marginTop: 10,
    textAlign: 'center',
  },
});

export default FeaturesScreen;