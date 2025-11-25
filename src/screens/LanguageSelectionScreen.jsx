// src/screens/LanguageSelectionScreen.jsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { Colors } from '../styles/color';
import { FontSizes, FontWeights } from '../styles/Fonts';
import Header from '../components/common/Header';
import Button from '../components/common/Button';
import CharacterImage from '../components/common/CharacterImage';

import { updateUserLanguage } from '../utils/api';

const LanguageSelectionScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const handleLanguageSelect = async (language) => {
    if (__DEV__) {
      console.log('[LanguageSelectionScreen] Selected language:', language);
    }

    setSelectedLanguage(language);

    try {
      // i18n 언어 변경
      await i18n.changeLanguage(language);

      // API 호출하여 언어 설정 저장
      const apiLanguage = language === 'ko' ? '한국어' : 'English';
      await updateUserLanguage(apiLanguage);

      if (__DEV__) {
        console.log('[LanguageSelectionScreen] Language saved to API:', apiLanguage);
      }

      // 목적 선택 화면으로 이동
      navigation.navigate('PurposeSelection');
    } catch (error) {
      console.error('[LanguageSelectionScreen] Language change error:', error);
      // API 오류가 발생하더라도 화면 이동은 진행할지 여부 결정 필요 (현재는 진행 안 함)
      // navigation.navigate('PurposeSelection'); 
    }
  };

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <CharacterImage style={styles.obooniCharacter} />
        <Text style={styles.languageQuestion}>
          {t('core.language_selection_question')}
        </Text>
        <View style={styles.buttonContainer}>
          <Button
            title="한국어"
            onPress={() => handleLanguageSelect('ko')}
            style={styles.languageButton}
            primary={selectedLanguage === 'ko'}
          />
          <Button
            title="English"
            onPress={() => handleLanguageSelect('en')}
            style={styles.languageButton}
            primary={selectedLanguage === 'en'}
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
  languageQuestion: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 30,
  },
  buttonContainer: {
    width: '90%',
    alignItems: 'center',
  },
  languageButton: {
    width: '90%',
    marginVertical: 10,
  },
});

export default LanguageSelectionScreen;
