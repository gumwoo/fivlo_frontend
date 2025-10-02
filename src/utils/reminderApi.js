// src/utils/reminderApi.js
// 백엔드 연동을 위한 API 함수들

const API_BASE_URL = 'https://api.fivlo.com'; // 실제 백엔드 URL로 변경

// 알림 관련 API
export const reminderApi = {
  // 알림 목록 조회
  getReminders: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reminders/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getAuthToken()}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('알림 목록 조회 실패:', error);
      throw error;
    }
  },

  // 알림 생성
  createReminder: async (reminderData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reminders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getAuthToken()}`,
        },
        body: JSON.stringify(reminderData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('알림 생성 실패:', error);
      throw error;
    }
  },

  // 알림 수정
  updateReminder: async (reminderId, reminderData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reminders/${reminderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getAuthToken()}`,
        },
        body: JSON.stringify(reminderData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('알림 수정 실패:', error);
      throw error;
    }
  },

  // 알림 삭제
  deleteReminder: async (reminderId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reminders/${reminderId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getAuthToken()}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('알림 삭제 실패:', error);
      throw error;
    }
  },

  // 알림 활성화/비활성화
  toggleReminder: async (reminderId, isActive) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reminders/${reminderId}/toggle`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getAuthToken()}`,
        },
        body: JSON.stringify({ isActive }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('알림 토글 실패:', error);
      throw error;
    }
  },
};

// 위치 관련 API
export const locationApi = {
  // 저장된 위치 목록 조회
  getSavedLocations: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/locations/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getAuthToken()}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('저장된 위치 목록 조회 실패:', error);
      throw error;
    }
  },

  // 위치 저장
  saveLocation: async (locationData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/locations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getAuthToken()}`,
        },
        body: JSON.stringify(locationData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('위치 저장 실패:', error);
      throw error;
    }
  },

  // 위치 삭제
  deleteLocation: async (locationId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/locations/${locationId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getAuthToken()}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('위치 삭제 실패:', error);
      throw error;
    }
  },
};

// 알림 기록 관련 API
export const reminderLogApi = {
  // 알림 기록 생성 (체크리스트 완료 시)
  createReminderLog: async (reminderId, completionData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reminder-logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getAuthToken()}`,
        },
        body: JSON.stringify({
          reminderId,
          ...completionData,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('알림 기록 생성 실패:', error);
      throw error;
    }
  },

  // 알림 기록 조회
  getReminderLogs: async (userId, dateRange) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reminder-logs/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getAuthToken()}`,
        },
        body: JSON.stringify(dateRange),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('알림 기록 조회 실패:', error);
      throw error;
    }
  },
};

// 푸시 알림 관련 API
export const notificationApi = {
  // 푸시 알림 토큰 등록
  registerPushToken: async (userId, pushToken) => {
    try {
      const response = await fetch(`${API_BASE_URL}/push-tokens`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getAuthToken()}`,
        },
        body: JSON.stringify({
          userId,
          pushToken,
          platform: Platform.OS,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('푸시 토큰 등록 실패:', error);
      throw error;
    }
  },

  // 푸시 알림 설정
  updateNotificationSettings: async (userId, settings) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notification-settings/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getAuthToken()}`,
        },
        body: JSON.stringify(settings),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('알림 설정 업데이트 실패:', error);
      throw error;
    }
  },
};

// 인증 토큰 가져오기 (AsyncStorage에서)
const getAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem('auth_token');
    return token;
  } catch (error) {
    console.error('인증 토큰 가져오기 실패:', error);
    return null;
  }
};

// 데이터 구조 정의
export const reminderDataStructure = {
  // 알림 데이터 구조
  reminder: {
    id: 'string', // UUID
    userId: 'string', // 사용자 ID
    title: 'string', // 알림 제목
    time: 'string', // 시간 (HH:MM 형식)
    location: 'string', // 장소명
    locationId: 'string', // 저장된 위치 ID (선택사항)
    isPremiumLocation: 'boolean', // 유료 위치 기능 사용 여부
    checklist: ['string'], // 체크리스트 항목들
    repeatDays: ['string'], // 반복 요일 (월, 화, 수, 목, 금, 토, 일)
    isActive: 'boolean', // 활성화 여부
    createdAt: 'string', // 생성일시 (ISO 8601)
    updatedAt: 'string', // 수정일시 (ISO 8601)
  },

  // 위치 데이터 구조
  location: {
    id: 'string', // UUID
    userId: 'string', // 사용자 ID
    name: 'string', // 위치명
    address: 'string', // 주소
    coordinates: {
      latitude: 'number', // 위도
      longitude: 'number', // 경도
    },
    radius: 'number', // 반경 (미터)
    createdAt: 'string', // 생성일시 (ISO 8601)
  },

  // 알림 기록 데이터 구조
  reminderLog: {
    id: 'string', // UUID
    reminderId: 'string', // 알림 ID
    userId: 'string', // 사용자 ID
    completedAt: 'string', // 완료일시 (ISO 8601)
    completedItems: ['string'], // 완료된 체크리스트 항목들
    allItemsCompleted: 'boolean', // 모든 항목 완료 여부
    location: {
      latitude: 'number', // 완료 시 위치 (위도)
      longitude: 'number', // 완료 시 위치 (경도)
    },
    coinsEarned: 'number', // 획득한 코인 수
  },
};

// 에러 처리 유틸리티
export const handleApiError = (error, defaultMessage = '오류가 발생했습니다.') => {
  if (error.response) {
    // 서버 응답이 있는 경우
    const status = error.response.status;
    switch (status) {
      case 401:
        return '인증이 필요합니다. 다시 로그인해주세요.';
      case 403:
        return '권한이 없습니다.';
      case 404:
        return '요청한 데이터를 찾을 수 없습니다.';
      case 500:
        return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      default:
        return error.response.data?.message || defaultMessage;
    }
  } else if (error.request) {
    // 네트워크 오류
    return '네트워크 연결을 확인해주세요.';
  } else {
    // 기타 오류
    return error.message || defaultMessage;
  }
};

export default {
  reminderApi,
  locationApi,
  reminderLogApi,
  notificationApi,
  reminderDataStructure,
  handleApiError,
};
