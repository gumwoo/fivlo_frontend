// src/screens/PurposeSelectionScreen.jsx

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { Colors } from '../styles/color';
import { FontSizes, FontWeights } from '../styles/Fonts';
import Header from '../components/common/Header';
import Button from '../components/common/Button';
import CharacterImage from '../components/common/CharacterImage';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../store/authStore';

const PurposeSelectionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { setUserPurpose } = useAuthStore();

  const handlePurposeSelect = (purpose) => {
    console.log('Selected purpose:', purpose);
    
    // authStore에 목적 저장
    setUserPurpose(purpose);
    
    if (__DEV__) {
      console.log('[PurposeSelection] Saved purpose:', purpose);
    }
    
    // --- 수정: 홈 화면으로 이동하고, 이전 스택을 모두 제거 ---
    if (route.params?.from === 'profile') {
      navigation.goBack(); // 프로필 수정에서 온 경우 → 원래 화면으로
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    }
  };

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <CharacterImage style={styles.obooniCharacter} />
        <Text style={styles.purposeQuestion}>
          {t('core.onboarding_question')}
        </Text>
        <View style={styles.buttonContainer}>
          <Button
            title={t('core.purpose_concentration')}
            onPress={() => handlePurposeSelect('concentration')}
            style={styles.purposeButton}
          />
          <Button
            title={t('core.purpose_routine')}
            onPress={() => handlePurposeSelect('routine')}
            style={styles.purposeButton}
            primary={false}
          />
          <Button
            title={t('core.purpose_goal')}
            onPress={() => handlePurposeSelect('goal')}
            style={styles.purposeButton}
            primary={false}
          />
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
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  obooniCharacter: {
    width: 200,
    height: 200,
    marginBottom: 40,
  },
  purposeQuestion: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 30,
  },
  buttonContainer: {
    width: '80%',
    alignItems: 'center',
  },
  purposeButton: {
    width: '100%',
    marginVertical: 8,
  },
});

export default PurposeSelectionScreen;