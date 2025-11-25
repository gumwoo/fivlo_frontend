import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAuthStore from '../store/authStore';

const API_BASE_URL = 'https://fivlo.net/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 추가
apiClient.interceptors.request.use(
  async (config) => {
    // 토큰 가져오기
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (__DEV__) {
      console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`, config.data);
    }
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// 토큰 재발급 함수
export const reissueToken = async (accessToken, refreshToken) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/reissue`, {
      accessToken,
      refreshToken,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 응답 인터셉터 추가
apiClient.interceptors.response.use(
  (response) => {
    if (__DEV__) {
      console.log(`[API Response] ${response.status} ${response.config.url}`, response.data);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 401 에러이고, 재시도하지 않은 요청인 경우
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const accessToken = await AsyncStorage.getItem('userToken');
        const refreshToken = await AsyncStorage.getItem('refreshToken');

        if (!accessToken || !refreshToken) {
          throw new Error('No tokens available');
        }

        if (__DEV__) {
          console.log('[API Info] Attempting token refresh...');
        }

        const { access, refresh } = await reissueToken(accessToken, refreshToken);

        // 새 토큰 저장
        const { setAuthData } = useAuthStore.getState();
        const userId = await AsyncStorage.getItem('userId');
        const isPremium = useAuthStore.getState().isPremiumUser;

        await setAuthData(access, refresh, userId, isPremium);

        // 원래 요청 헤더 업데이트 및 재시도
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return apiClient(originalRequest);

      } catch (refreshError) {
        console.error('[API Error] Token refresh failed:', refreshError);

        // 로그아웃 처리
        const { logout } = useAuthStore.getState();
        await logout();

        // 필요하다면 여기서 네비게이션 처리 등을 할 수 있지만, 
        // 보통 상태 변경으로 인해 UI가 반응하도록 하는 것이 좋습니다.
        return Promise.reject(refreshError);
      }
    }

    if (error.response && error.response.status === 409) {
      if (__DEV__) console.log('[API Info] 409 Conflict (Handled in UI):', error.response.data);
    }
    else if (error.response) {
      console.error('[API Response Error]', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('[API No Response]', error.request);
    } else {
      console.error('[API Error]', error.message);
    }
    return Promise.reject(error);
  }
);

export const signUpWithEmail = async (email, password) => {
  const response = await apiClient.post('/auth/signup', { email, password });
  return response.data;
};

export const loginWithEmail = async (email, password) => {
  const response = await apiClient.post('/auth/signin', { email, password });
  return response.data;
};

// 온보딩 목표 설정/수정 (REQ-BE-USER-002)
export const updateOnboardingType = async (onboardingType) => {
  const response = await apiClient.post('/users/onboarding', { onboardingType });
  return response.data;
};

// 사용자 프로필 조회 (REQ-BE-USER-001)
export const getUserProfile = async () => {
  const response = await apiClient.get('/users/me');
  return response.data;
};

// 사용자 프로필 수정 (REQ-BE-USER-001)
export const updateUserProfile = async (nickname, profileImageUrl) => {
  const response = await apiClient.patch('/users/me', { nickname, profileImageUrl });
  return response.data;
};

// 언어 설정 (REQ-BE-USER-003)
export const updateUserLanguage = async (language) => {
  const response = await apiClient.post('/users/languages', { language });
  return response.data;
};

// 사용자 목적 저장 및 조회 (REQ-BE-USER-002)
export const saveUserPurpose = async (userId, purpose) => {
  const response = await apiClient.post(`/users/${userId}/purpose`, { purpose });
  return response.data;
};

export const getUserPurpose = async (userId) => {
  const response = await apiClient.get(`/users/${userId}/purpose`);
  return response.data;
};

// 다른 API들도 여기에 추가...
// 루틴 관리 API (REQ-BE-ROUTINE-001)
export const createRoutine = async (routineData) => {
  const response = await apiClient.post('/routines', routineData);
  return response.data;
};

export const getRoutinesByDate = async (date) => {
  const response = await apiClient.get(`/routines?date=${date}`);
  return response.data;
};

// AI 목표 세분화 API (REQ-BE-AI-001)
export const getAiSuggestions = async (goal) => {
  const response = await apiClient.post('/ai/suggest-plans', { goal });
  return response.data;
};

// ... 등 백엔드 요구사항에 맞춰 API 함수들을 정의합니다.
