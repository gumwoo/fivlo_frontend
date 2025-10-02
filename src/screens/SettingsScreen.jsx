// src/screens/SettingsScreen.jsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import Header from '../components/common/Header';
import { Colors } from '../styles/color';
import { FontSizes, FontWeights } from '../styles/Fonts';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../i18n';

const SettingsScreen = ({ initialIsPremiumUser = true }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();

  const [isPremiumUser, setIsPremiumUser] = useState(initialIsPremiumUser);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isLanguageExpanded, setIsLanguageExpanded] = useState(false);

  // ✨ 수정: 'ProfileSettings' 대신 'AccountManagement'로 이동하도록 경로를 바로잡았습니다.
  const handleProfilePress = () => navigation.navigate('AccountManagement');
  
  const handlePremiumPress = () => navigation.navigate('PremiumMembership');
  const handleInfoPress = () => navigation.navigate('Information');
  const handleReportPress = () => navigation.navigate('Report');
  
  const handleSelectLanguage = (lang) => {
    changeLanguage(lang);
    setIsLanguageExpanded(false);
  };

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top }]}>
      <Header title={t('settings.title')} showBackButton={true} />
      
      <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
        {/* 프로필 섹션 */}
        <TouchableOpacity style={styles.profileContainer} onPress={handleProfilePress}>
          <FontAwesome5 name="user-circle" size={48} color={Colors.secondaryBrown} style={styles.profileIcon} />
          <View style={styles.profileTextContainer}>
            <Text style={styles.profileName}>{t('settings.profile_name', '이름')}</Text>
            {isPremiumUser ? (
              <View style={styles.premiumInfoContainer}>
                <Text style={styles.profileStatusPremium}>{t('settings.premium_account', '프리미엄 계정')}</Text>
                <FontAwesome5 name="coins" size={12} color="#FFC700" style={{ marginRight: 4 }}/>
                <Text style={styles.profileCoins}>{t('settings.coins_owned', { count: 5 })}</Text>
              </View>
            ) : (
              <Text style={styles.profileStatusNormal}>{t('settings.normal_account', '일반계정')}</Text>
            )}
          </View>
        </TouchableOpacity>

        {/* 설정 목록 */}
        <View style={styles.settingsListContainer}>
          {/* 알림 */}
          <View style={styles.settingItem}>
            <Text style={styles.settingItemText}>{t('settings.notifications', '알림')}</Text>
            <Switch
              trackColor={{ false: '#767577', true: Colors.accentApricot }}
              thumbColor={Colors.textLight}
              onValueChange={() => setNotificationsEnabled(previousState => !previousState)}
              value={notificationsEnabled}
            />
          </View>

          {/* 언어 */}
          <View>
            <TouchableOpacity style={styles.settingItem} onPress={() => setIsLanguageExpanded(!isLanguageExpanded)}>
              <Text style={styles.settingItemText}>{t('settings.language', '언어')}</Text>
              <View style={styles.languagePicker}>
                <FontAwesome5 name="globe" size={16} color={Colors.secondaryBrown} style={{ marginRight: 8 }}/>
                <Text style={styles.settingItemText}>{i18n.language === 'ko' ? t('settings.language_korean') : t('settings.language_english')}</Text>
                <FontAwesome5 name={isLanguageExpanded ? "chevron-up" : "chevron-down"} size={14} color={Colors.secondaryBrown} style={{ marginLeft: 8 }}/>
              </View>
            </TouchableOpacity>

            {isLanguageExpanded && (
              <View style={styles.languageExpandedContainer}>
                <TouchableOpacity style={styles.languageOptionButton} onPress={() => handleSelectLanguage('ko')}>
                  <Text style={[styles.languageOptionText, i18n.language === 'ko' && styles.languageOptionTextActive]}>
                    {t('settings.language_korean')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.languageOptionButton} onPress={() => handleSelectLanguage('en')}>
                  <Text style={[styles.languageOptionText, i18n.language === 'en' && styles.languageOptionTextActive]}>
                    {t('settings.language_english')}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* FIVLO 프리미엄 멤버십 */}
          <TouchableOpacity style={styles.settingItem} onPress={handlePremiumPress}>
            <Text style={styles.settingItemText}>{t('settings.premium_membership', 'FIVLO 프리미엄 멤버십')}</Text>
            <FontAwesome5 name="chevron-right" size={16} color={Colors.secondaryBrown} />
          </TouchableOpacity>

          {/* 정보 */}
          <TouchableOpacity style={styles.settingItem} onPress={handleInfoPress}>
            <Text style={styles.settingItemText}>{t('settings.information', '정보')}</Text>
            <FontAwesome5 name="chevron-right" size={16} color={Colors.secondaryBrown} />
          </TouchableOpacity>

          
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
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.textLight,
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  profileIcon: {
    marginRight: 15,
  },
  profileTextContainer: {
    flex: 1,
  },
  profileName: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 6,
  },
  profileStatusNormal: {
    fontSize: FontSizes.medium,
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  premiumInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileStatusPremium: {
    fontSize: FontSizes.medium,
    color: Colors.secondaryBrown,
    marginRight: 10,
  },
  profileCoins: {
    fontSize: FontSizes.medium,
    color: Colors.secondaryBrown,
    fontWeight: FontWeights.medium,
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
  languagePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryBeige,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.secondaryBrown,
  },
  languageExpandedContainer: {
    backgroundColor: Colors.primaryBeige,
    paddingHorizontal: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primaryBeige,
  },
  languageOptionButton: {
    paddingVertical: 12,
  },
  languageOptionText: {
    fontSize: FontSizes.medium,
    color: Colors.secondaryBrown,
  },
  languageOptionTextActive: {
    color: Colors.accentApricot,
    fontWeight: FontWeights.bold,
  },
});

export default SettingsScreen;