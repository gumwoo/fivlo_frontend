// src/screens/InformationScreen.jsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Header from '../components/common/Header';
import { Colors } from '../styles/color';
import { FontSizes, FontWeights } from '../styles/Fonts';
import { FontAwesome5 } from '@expo/vector-icons';

const InformationScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  // 외부 링크 열기 함수
  const openExternalLink = async (url, title) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(
          t('information.link_error_title'),
          t('information.link_error_message', { title })
        );
      }
    } catch (error) {
      Alert.alert(
        t('information.link_error_title'),
        t('information.link_error_message', { title })
      );
    }
  };

  const handleTermsOfUse = () => {
    openExternalLink(
      'https://www.notion.so/FIVLO-27753e2a13918044bb0cc85c5f2ca087?source=copy_link',
      t('information.terms_of_use')
    );
  };

  const handlePrivacyPolicy = () => {
    openExternalLink(
      'https://www.notion.so/FIVLO-27753e2a13918029936ec61f3930eea7?source=copy_link',
      t('information.privacy_policy')
    );
  };

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top }]}>
      <Header title={t('information.title')} showBackButton={true} />
      
      <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
        <View style={styles.settingsListContainer}>
          {/* 이용 약관 */}
          <TouchableOpacity style={styles.settingItem} onPress={handleTermsOfUse}>
            <Text style={styles.settingItemText}>{t('information.terms_of_use')}</Text>
            <FontAwesome5 name="chevron-right" size={16} color={Colors.secondaryBrown} />
          </TouchableOpacity>

          {/* 개인정보 처리방침 */}
          <TouchableOpacity style={styles.settingItem} onPress={handlePrivacyPolicy}>
            <Text style={styles.settingItemText}>{t('information.privacy_policy')}</Text>
            <FontAwesome5 name="chevron-right" size={16} color={Colors.secondaryBrown} />
          </TouchableOpacity>

          {/* 버전 */}
          <View style={styles.settingItem}>
            <Text style={styles.settingItemText}>{t('information.version')}</Text>
            <Text style={styles.versionText}>1.0.0</Text>
          </View>
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
    padding: 20,
  },
  settingsListContainer: {
    backgroundColor: Colors.textLight,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primaryBeige,
  },
  settingItemText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    fontWeight: FontWeights.regular,
  },
  versionText: {
    fontSize: FontSizes.medium,
    color: Colors.secondaryBrown,
    fontWeight: FontWeights.medium,
  },
});

export default InformationScreen;
