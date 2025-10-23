// src/screens/PomodoroFinishScreen.jsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Modal, ScrollView, Alert } from 'react-native'; // ScrollView 임포트 추가!
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// 공통 스타일 및 컴포넌트 임포트
import { GlobalStyles } from '../../styles/GlobalStyles';
import { Colors } from '../../styles/color'; // <-- 사용자님 파일명에 맞춰 'color'로 수정!
import { FontSizes, FontWeights } from '../../styles/Fonts'; // <-- 사용자님 파일명에 맞춰 'Fonts'로 수정!
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import TimeAttackMascot from '../../components/timeattack/TimeAttackMascot';
import { useTranslation } from 'react-i18next';

const PomodoroFinishScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const { selectedGoal } = route.params;
  const [showCoinModal, setShowCoinModal] = useState(false);
  const [isPremiumUser, setIsPremiumUser] = useState(true);

  useEffect(() => {
    if (isPremiumUser) {
      const timer = setTimeout(() => {
        setShowCoinModal(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleGoToAnalysis = () => {
    Alert.alert(t('pomodoro.navigate'), t('pomodoro.navigate_to_analysis'));
  };

  const handleGoToHome = () => {
    navigation.popToTop();
    navigation.navigate('Main', { screen: 'HomeTab' });
  };

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top }]}>
      <Header title={t('pomodoro.header')} showBackButton={true} />

      <ScrollView contentContainerStyle={styles.contentContainer}>        
        <Image
          source={require('../../../assets/오분이_신난이미지.png')}
          style={{ width: 250, height: 250, marginBottom: 50 }}
          resizeMode="contain"
        />
        <Text style={styles.finishText}>{t('pomodoro.finish_title')}</Text>
        <Text style={styles.finishMessage}>{t('pomodoro.finish_message')}</Text>
        <View style={styles.buttonContainer}>
          <Button title={t('pomodoro.to_analysis')} onPress={handleGoToAnalysis} style={styles.actionButton} />
        </View>
      </ScrollView>

      {showCoinModal && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={showCoinModal}
          onRequestClose={() => setShowCoinModal(false)}
        >
          <View style={styles.coinModalOverlay}>
            <View style={styles.coinModalContent}>
              <Image source={require('../../../assets/coin.png')} style={styles.modalObooni} />
              <Text style={styles.modalMessage}>
                {t('pomodoro.finish_modal_message')}
              </Text>
              <Button title={t('pomodoro.ok')} onPress={() => setShowCoinModal(false)} style={styles.modalButton} />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.primaryBeige,
  },
  contentContainer: { // ScrollView의 contentContainerStyle로 사용
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  finishText: {
    fontSize: FontSizes.extraLarge,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 10,
    textAlign: 'center',
  },
  finishMessage: {
    fontSize: FontSizes.large,
    color: Colors.secondaryBrown,
    marginBottom: 30,
    textAlign: 'center',
  },
  obooniCharacter: {
    width: 250,
    height: 250,
    marginBottom: 50,
  },
  buttonContainer: {
    width: '80%',
    alignItems: 'center',
  },
  actionButton: {
    marginBottom: 15,
  },
  coinModalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  coinModalContent: {
    backgroundColor: Colors.textLight,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  modalObooni: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  modalMessage: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 28,
  },
  modalButton: {
    width: '70%',
  },
});

export default PomodoroFinishScreen;
