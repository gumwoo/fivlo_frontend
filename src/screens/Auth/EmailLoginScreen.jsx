// src/screens/Auth/EmailLoginScreen.jsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { GlobalStyles } from '../../styles/GlobalStyles';
import { Colors } from '../../styles/color'; // <-- 사용자님 파일명에 맞춰 'color'로 수정!
import { FontSizes, FontWeights } from '../../styles/Fonts'; // <-- 사용자님 파일명에 맞춰 'Fonts'로 수정!
import Header from '../../components/common/Header';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

const EmailLoginScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(t('core.auth.login_error_title'), t('core.auth.login_error_message'));
      return;
    }

    if (__DEV__) {
      console.log('[EmailLoginScreen] Login attempt:', { email });
    }
    Alert.alert(t('core.auth.login_success_title'), t('core.auth.login_success_message'));
    
    // 로그인 성공 후 언어 선택 화면으로 이동
    navigation.navigate('LanguageSelection');
    };

  return (
    <View style={[GlobalStyles.container, { paddingTop: insets.top }]}>
      <Header title={t('core.auth.login_header')} showBackButton={true} />
      <ScrollView contentContainerStyle={styles.formContainer}>
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

        <Button
          title={t('core.auth.login_header')}
          onPress={handleLogin}
          style={styles.loginButton}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    flexGrow: 1,
    width: '80%',
    alignItems: 'center',
    marginTop: 50,
    paddingBottom: 40,
  },
  loginButton: {
    marginTop: 30,
  },
});

export default EmailLoginScreen;
