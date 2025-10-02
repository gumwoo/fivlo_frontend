// src/screens/FeaturesScreen.jsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../components/common/Header';
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
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.grid}>
          {features.map((feature, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.item}
              activeOpacity={0.7}
              onPress={() => handleFeaturePress(feature.screen)}
            >
              <Image source={feature.image} style={styles.icon} />
              <Text style={styles.label} numberOfLines={1}>{feature.name}</Text>
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
  content: {
    paddingHorizontal: 16,
    paddingTop: 80,      // 헤더 아래 여백
    paddingBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // 2열 그리드
  },
  item: {
    width: '48%',        // 2열
    alignItems: 'center',
    marginBottom: 24,
    // ✅ 카드 배경/그림자 완전히 제거
  },
  icon: {
    width: 150,           // 아이콘 크게
    height: 130,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  label: {
    fontSize: FontSizes.medium,
    fontWeight: FontWeights.medium,
    color: Colors.textDark,
    textAlign: 'center',
  },
});

export default FeaturesScreen;
