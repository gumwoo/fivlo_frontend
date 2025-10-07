// src/screens/Auth/EmailSignUpScreen.jsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { GlobalStyles } from '../../styles/GlobalStyles';
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Header from '../../components/common/Header';
import Input from '../../components/common/Input';
import Checkbox from '../../components/common/Checkbox';
import Button from '../../components/common/Button';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

const EmailSignUpScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isOver14, setIsOver14] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password || !isOver14 || !agreedToTerms) {
      Alert.alert(t('core.auth.signup_error_title'), t('core.auth.signup_error_message'));
      return;
    }
    if (password.length < 6) {
      Alert.alert(t('core.auth.password_error_title'), t('core.auth.password_error_message'));
      return;
    }

    try {
      if (__DEV__) {
        console.log('[EmailSignUpScreen] Sign up attempt:', { email });
      }
      Alert.alert(t('core.auth.signup_success_title'), t('core.auth.signup_success_message'));
      
      // 회원가입 성공 후 언어 선택 화면으로 이동
      navigation.navigate('LanguageSelection');
    } catch (error) {
      console.error('회원가입 실패:', error);
      Alert.alert(t('core.auth.signup_fail_title'), t('core.auth.signup_fail_message'));
    }
  };

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top }]}>
      <Header title={t('core.auth.signup_header')} showBackButton={true} />
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
        <View style={styles.checkboxContainer}>
          <Checkbox
            label={t('core.auth.over14')}
            isChecked={isOver14}
            onPress={() => setIsOver14(!isOver14)}
          />
          <Checkbox
            label={t('core.auth.agree_terms')}
            isChecked={agreedToTerms}
            onPress={() => setAgreedToTerms(!agreedToTerms)}
          />
        </View>
      </View>
      
      <View style={styles.buttonContainer}>
        <Button
          title={t('core.auth.start_routine')}
          onPress={handleSignUp}
          style={styles.signUpButton}
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
  checkboxContainer: {
    width: 260,
    alignItems: 'flex-start',
    marginTop: 10,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  signUpButton: {
    width: '80%',
  },
});

export default EmailSignUpScreen;