// src/screens/OnboardingScreen.jsx

import React, { useEffect } from 'react';
import { View, StyleSheet, Image, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GlobalStyles } from '../styles/GlobalStyles'; // 전역 스타일은 유지

const OnboardingScreen = () => {
  const navigation = useNavigation();

  // 1.5초 후에 다음 화면으로 자동 전환
  useEffect(() => {
    const timer = setTimeout(() => {
      // replace를 사용하여 뒤로가기 시 온보딩 화면으로 돌아오지 않도록 함
      navigation.replace('AuthChoice'); 
    }, 1500); // 1.5초 = 1500ms

    // 컴포넌트가 언마운트될 때 타이머를 정리하여 메모리 누수 방지
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    // GlobalStyles.container를 사용하여 일관된 배경색과 flex 속성 유지
    <View style={[GlobalStyles.container, styles.container]}>
      {/* 상태바 스타일을 화면에 맞게 조절할 수 있습니다. */}
      <StatusBar barStyle="dark-content" />
      <Image
        source={require('../../assets/로고.png')}
        style={styles.logo}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center', // 로고를 수직 중앙에 배치
    alignItems: 'center',   // 로고를 수평 중앙에 배치
  },
  logo: {
    width: 250,
    height: 100, // 로고 비율에 맞게 높이 조절
    resizeMode: 'contain',
  },
});

export default OnboardingScreen;