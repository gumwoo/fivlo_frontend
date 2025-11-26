// src/screens/Auth/EmailLoginScreen.jsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { GlobalStyles } from '../../styles/GlobalStyles';
import { Colors } from '../../styles/color'; // <-- 파일명에 맞춰 'color'로 수정!
import { FontSizes, FontWeights } from '../../styles/Fonts'; // <-- 파일명에 맞춰 'Fonts'로 수정!
import Header from '../../components/common/Header';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { loginWithEmail } from '../../utils/api';
import useAuthStore from '../../store/authStore';

const EmailLoginScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { setAuthData } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(t('core.auth.login_error_title'), t('core.auth.login_error_message'));
      return;
    }

    try {
      const data = await loginWithEmail(email, password);

      if (__DEV__) {
        console.log('[EmailLoginScreen] Login success:', data);
      }

      // 스토어에 인증 정보 저장 (isPremium 포함)
      await setAuthData(data.accessToken, data.refreshToken, data.userId, data.isPremium);

      Alert.alert(t('core.auth.login_success_title'), t('core.auth.login_success_message'));

      // 로그인 성공 후 언어 선택 화면으로 이동
      navigation.navigate('LanguageSelection');
    } catch (error) {
      console.error('로그인 실패:', error);
      Alert.alert(t('core.auth.login_fail_title'), t('core.auth.login_fail_message'));
    }
  };


  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top }]}>
      <Header title={t('core.auth.login_header')} showBackButton={true} />
      <View style={styles.formContainer}>
        <Input
          placeholder={t('core.auth.email_placeholder')}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <Input
          placeholder={t('core.auth.password_placeholder')}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title={t('core.auth.login_header')}
          onPress={handleLogin}
          style={styles.loginButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.primaryBeige,
  },
  formContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    paddingTop: 80,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loginButton: {
    width: '80%',
  },
});

export default EmailLoginScreen;
