import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';

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

// 응답 인터셉터 추가
apiClient.interceptors.response.use(
  (response) => {
    if (__DEV__) {
      console.log(`[API Response] ${response.status} ${response.config.url}`, response.data);
    }
    return response;
  },
  (error) => {
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
