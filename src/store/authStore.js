// src/store/authStore.js

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_PURPOSE_KEY = 'userPurpose';

const useAuthStore = create((set) => ({
  userToken: null,
  userPurpose: null,
  
  // ✨ [수정] isPremiumUser 상태를 추가하고 기본값을 false로 설정하여 프리미엄 기능 테스트를 가능하게 합니다.
  isPremiumUser: false, 

  setUserToken: (token) => set({ userToken: token }),
  
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
  
  // ✨ [추가] 나중에 실제 결제 연동 시 프리미엄 상태를 변경할 함수 (선택 사항)
  setIsPremiumUser: (isPremium) => set({ isPremiumUser: isPremium }), 

  // ✨ [수정] 로그아웃 시 isPremiumUser 상태도 초기화합니다.
  logout: async () => {
    try {
      await AsyncStorage.removeItem(USER_PURPOSE_KEY);
      set({ userToken: null, userPurpose: null, isPremiumUser: false });
    } catch (error) {
      console.error('[AuthStore] Logout error:', error);
    }
  },
}));

export default useAuthStore;