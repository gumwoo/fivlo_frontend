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
import { updateOnboardingType } from '../utils/api';

const PurposeSelectionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { setUserPurpose } = useAuthStore();

  const handlePurposeSelect = async (purpose) => {
    console.log('Selected purpose:', purpose);

    // 1. API에 보낼 값 매핑
    const purposeMapping = {
      'concentration': '집중력_개선',
      'routine': '루틴_형성',
      'goal': '목표_관리'
    };
    const apiValue = purposeMapping[purpose] || '목표_관리';

    try {
      // 2. API 호출
      await updateOnboardingType(apiValue);

      if (__DEV__) {
        console.log('[PurposeSelection] API updated:', apiValue);
      }

      // 3. 로컬 스토어에 목적 저장
      setUserPurpose(purpose);

      // 4. 화면 이동
      if (route.params?.from === 'profile') {
        navigation.goBack(); // 프로필 수정에서 온 경우 → 원래 화면으로
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
      }
    } catch (error) {
      console.error('[PurposeSelection] Failed to update onboarding type:', error);
      // 에러가 나더라도 진행을 막을지, 아니면 알림을 띄울지 결정 필요. 
      // 우선은 진행하되 에러 로그를 남김.

      // 로컬 스토어에는 저장하고 이동 (사용자 경험을 위해)
      setUserPurpose(purpose);
      if (route.params?.from === 'profile') {
        navigation.goBack();
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
      }
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