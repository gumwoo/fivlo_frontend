// src/store/authStore.js

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_PURPOSE_KEY = 'userPurpose';
const USER_PROFILE_IMAGE_KEY = 'userProfileImage';

const useAuthStore = create((set) => ({
  userToken: null,
  refreshToken: null,
  userId: null,
  userPurpose: null,
  userProfileImage: null,

  // ✨ [수정] isPremiumUser 상태를 추가하고 기본값을 false로 설정하여 프리미엄 기능 테스트를 가능하게 합니다.
  isPremiumUser: false,

  setUserToken: (token) => set({ userToken: token }),

  setAuthData: async (accessToken, refreshToken, userId, isPremium = false) => {
    try {
      await AsyncStorage.setItem('userToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      await AsyncStorage.setItem('userId', String(userId));
      set({ userToken: accessToken, refreshToken, userId, isPremiumUser: isPremium });
    } catch (error) {
      console.error('[AuthStore] Save auth data error:', error);
    }
  },

  setUserPurpose: async (purpose) => {
    try {
      await AsyncStorage.setItem(USER_PURPOSE_KEY, purpose);
      set({ userPurpose: purpose });
      if (__DEV__) {
        console.log('[AuthStore] Saved purpose:', purpose);
      }
    } catch (error) {
      console.error('[AuthStore] Save purpose error:', error);
    }
  },

  // 프로필 이미지 저장
  setUserProfileImage: async (imageUri) => {
    try {
      await AsyncStorage.setItem(USER_PROFILE_IMAGE_KEY, imageUri);
      set({ userProfileImage: imageUri });
      if (__DEV__) {
        console.log('[AuthStore] Saved profile image:', imageUri);
      }
    } catch (error) {
      console.error('[AuthStore] Save profile image error:', error);
    }
  },

  // 앱 시작 시 저장된 목적 불러오기
  loadUserPurpose: async () => {
    try {
      const purpose = await AsyncStorage.getItem(USER_PURPOSE_KEY);
      if (purpose) {
        set({ userPurpose: purpose });
        if (__DEV__) {
          console.log('[AuthStore] Loaded purpose:', purpose);
        }
      }
    } catch (error) {
      console.error('[AuthStore] Load purpose error:', error);
    }
  },

  // 앱 시작 시 프로필 이미지 불러오기
  loadUserProfileImage: async () => {
    try {
      const imageUri = await AsyncStorage.getItem(USER_PROFILE_IMAGE_KEY);
      if (imageUri) {
        set({ userProfileImage: imageUri });
        if (__DEV__) {
          console.log('[AuthStore] Loaded profile image:', imageUri);
        }
      }
    } catch (error) {
      console.error('[AuthStore] Load profile image error:', error);
    }
  },

  // ✨ [추가] 나중에 실제 결제 연동 시 프리미엄 상태를 변경할 함수 (선택 사항)
  setIsPremiumUser: (isPremium) => set({ isPremiumUser: isPremium }),

  // ✨ [수정] 로그아웃 시 isPremiumUser 상태도 초기화합니다.
  logout: async () => {
    try {
      await AsyncStorage.removeItem(USER_PURPOSE_KEY);
      await AsyncStorage.removeItem(USER_PROFILE_IMAGE_KEY);
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('userId');
      set({ userToken: null, refreshToken: null, userId: null, userPurpose: null, userProfileImage: null, isPremiumUser: false });
    } catch (error) {
      console.error('[AuthStore] Logout error:', error);
    }
  },
}));

export default useAuthStore;