import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { GlobalStyles } from '../../styles/GlobalStyles';
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Button from '../../components/common/Button';
import CharacterImage from '../../components/common/CharacterImage';
import Header from '../../components/common/Header';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { socialLogin } from '../../utils/api';
import useAuthStore from '../../store/authStore';

// ✅ 로고 이미지 불러오기
const logo = require('../../../assets/logo.png');

const AuthChoiceScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { setAuthData } = useAuthStore();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '932554607105-jc7kcibhrfhhsegmi2kfkr6rmt5rkol9.apps.googleusercontent.com',
      offlineAccess: true,
    });
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      if (userInfo.idToken) {
        if (__DEV__) {
          console.log('[AuthChoice] Google ID Token:', userInfo.idToken);
        }

        // 백엔드 소셜 로그인 API 호출
        const response = await socialLogin('GOOGLE', userInfo.idToken);

        if (__DEV__) {
          console.log('[AuthChoice] Social Login Success:', response);
        }

        // 토큰 저장 및 상태 업데이트
        const { accessToken, refreshToken, userId, isNewUser, onboardingType } = response;
        await setAuthData(accessToken, refreshToken, userId);

        // 신규 유저이거나 온보딩 정보가 없으면 온보딩으로, 아니면 메인으로
        if (isNewUser || !onboardingType) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'PurposeSelection' }],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: 'MainTabs' }],
          });
        }
      } else {
        throw new Error('No ID token present');
      }
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('[AuthChoice] User cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('[AuthChoice] Sign in is in progress already');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('[AuthChoice] Play services not available or outdated');
        Alert.alert(t('common.error'), 'Google Play Services가 필요합니다.');
      } else {
        console.error('[AuthChoice] Google Sign-In Error:', error);
        Alert.alert(t('common.error'), '구글 로그인 중 오류가 발생했습니다.');
      }
    }
  };

  const handleAppleSignIn = () => {
    console.log('Apple Sign In');
    Alert.alert('알림', '애플 로그인은 준비 중입니다.');
  };

  const handleKakaoSignIn = () => {
    console.log('Kakao Sign In');
    Alert.alert('알림', '카카오 로그인은 준비 중입니다.');
  };

  const handleEmailSignUp = () => {
    navigation.navigate('EmailSignUp');
  };

  const handleLogin = () => {
    navigation.navigate('EmailLogin');
  };

  return (
    <View style={[GlobalStyles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>

        {/* ✅ 여기서 직접 로고 이미지를 사용 */}
        <Image source={logo} style={styles.logo} />

        <Text style={styles.tagline}>
          {t('core.auth.tagline')}
        </Text>

        <View style={styles.buttonContainer}>
          <Button
            title={t('core.auth.google')}
            onPress={handleGoogleSignIn}
            variant="brand"
            brandType="google"
          />
          <Button
            title={t('core.auth.apple')}
            onPress={handleAppleSignIn}
            variant="brand"
            brandType="apple"
          />
          <Button
            title={t('core.auth.kakao')}
            onPress={handleKakaoSignIn}
            variant="brand"
            brandType="kakao"
          />
          <Button
            title={t('core.auth.email')}
            onPress={handleEmailSignUp}
            variant="default"
          />
          <TouchableOpacity onPress={handleLogin} style={styles.loginTextButton}>
            <Text style={styles.loginText}>{t('core.auth.login')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollViewContentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  logo: {
    width: 350,
    height: 150,
    resizeMode: 'contain',
    marginTop: 10,
    marginBottom: 30
  },
  obooniCharacter: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  tagline: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  buttonContainer: {
    width: '75%',
    alignItems: 'center',
  },
  loginTextButton: {
    marginTop: 0,
    padding: 20,
  },
  loginText: {
    color: Colors.secondaryBrown,
    fontSize: FontSizes.medium,
    fontWeight: FontWeights.medium,
    textDecorationLine: 'underline',
  },
});

export default AuthChoiceScreen;
