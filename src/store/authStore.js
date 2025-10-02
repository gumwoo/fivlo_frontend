// src/store/authStore.js

import { create } from 'zustand';

const useAuthStore = create((set) => ({
  userToken: null,
  userPurpose: null,
  
  // ✨ [수정] isPremiumUser 상태를 추가하고 기본값을 false로 설정하여 프리미엄 기능 테스트를 가능하게 합니다.
  isPremiumUser: false, 

  setUserToken: (token) => set({ userToken: token }),
  setUserPurpose: (purpose) => set({ userPurpose: purpose }),
  
  // ✨ [추가] 나중에 실제 결제 연동 시 프리미엄 상태를 변경할 함수 (선택 사항)
  setIsPremiumUser: (isPremium) => set({ isPremiumUser: isPremium }), 

  // ✨ [수정] 로그아웃 시 isPremiumUser 상태도 초기화합니다.
  logout: () => set({ userToken: null, userPurpose: null, isPremiumUser: false }), 
}));

export default useAuthStore;