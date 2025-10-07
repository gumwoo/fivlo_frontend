// src/screens/ObooniCustomizationScreen.jsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native'; // Modal 임포트 제거
import { useNavigation, useRoute } from '@react-navigation/native'; // useRoute 임포트 추가
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// FontAwesome5는 이제 Lock 아이콘을 사용하지 않으므로 제거
// import { FontAwesome5 } from '@expo/vector-icons'; 

// 공통 스타일 및 컴포넌트 임포트
import { GlobalStyles } from '../../styles/GlobalStyles';
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Button from '../../components/common/Button';
import CharacterImage from '../../components/common/CharacterImage';
import Header from '../../components/common/Header'; // Header 임포트 추가
import { useTranslation } from 'react-i18next';

const ObooniCustomizationScreen = () => { // isVisible, onClose prop 제거
  const navigation = useNavigation();
  const route = useRoute(); // route 훅을 사용하여 params에 접근
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const isPremiumUser = route.params?.isPremiumUser || false; // params에서 isPremiumUser 받기

  const handleGoToCloset = () => {
    // onClose() 제거
    navigation.navigate('ObooniCloset'); // ObooniClosetScreen으로 이동
  };

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top }]}>
      {/* Header를 사용하여 뒤로가기 버튼과 타이틀 제공 */}
      <Header title={t('obooni.customize_header')} showBackButton={true} />

      <View style={styles.contentContainer}> {/* 새로운 컨테이너 추가 */}
        {/* 이제 유료/무료 분기 없이 항상 이 내용을 보여줍니다. */}
        <Text style={styles.premiumTitle}>{t('obooni.closet_title')}</Text>
        <CharacterImage style={styles.obooniImage} />
        <Text style={styles.premiumMessage}>
          {t('obooni.customize_message')}
        </Text>
        <Button title={t('obooni.go_to_closet')} onPress={handleGoToCloset} style={styles.actionButton} />
        <Button title={t('obooni.close')} onPress={() => navigation.goBack()} primary={false} style={styles.actionButton} /> {/* navigation.goBack() 사용 */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: { // 이 스크린 자체의 컨테이너
    flex: 1,
    backgroundColor: Colors.primaryBeige,
  },
  contentContainer: { // 모달 내용처럼 중앙에 배치될 컨테이너
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40, // 하단 버튼과의 여백
  },
  premiumTitle: {
    fontSize: FontSizes.extraLarge,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 20,
  },
  obooniImage: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  premiumMessage: {
    fontSize: FontSizes.medium,
    color: Colors.secondaryBrown,
    textAlign: 'center',
    marginBottom: 30,
  },
  actionButton: {
    width: '100%',
    marginBottom: 15,
  },
});

export default ObooniCustomizationScreen;
