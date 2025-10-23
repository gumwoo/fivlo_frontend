// src/store/focusStore.js

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FOCUS_RECORDS_KEY = 'focusRecords';

const useFocusStore = create((set, get) => ({
  records: [],
  isLoaded: false,

  // AsyncStorage에서 기록 불러오기
  loadRecords: async () => {
    try {
      const stored = await AsyncStorage.getItem(FOCUS_RECORDS_KEY);
      if (stored) {
        const records = JSON.parse(stored);
        set({ records, isLoaded: true });
        if (__DEV__) {
          console.log('[FocusStore] Loaded records:', records.length);
        }
      } else {
        set({ isLoaded: true });
      }
    } catch (error) {
      console.error('[FocusStore] Load error:', error);
      set({ isLoaded: true });
    }
  },

  // 새 기록 추가
  addRecord: async (record) => {
    try {
      const newRecord = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        timestamp: new Date().toISOString(),
        ...record,
      };

      const updatedRecords = [...get().records, newRecord];
      set({ records: updatedRecords });

      // AsyncStorage에 저장
      await AsyncStorage.setItem(FOCUS_RECORDS_KEY, JSON.stringify(updatedRecords));

      if (__DEV__) {
        console.log('[FocusStore] Added record:', newRecord);
      }

      return newRecord;
    } catch (error) {
      console.error('[FocusStore] Add error:', error);
      return null;
    }
  },

  // 특정 날짜의 기록 가져오기
  getRecordsByDate: (date) => {
    return get().records.filter((record) => record.date === date);
  },

  // 날짜 범위의 기록 가져오기
  getRecordsByDateRange: (startDate, endDate) => {
    return get().records.filter((record) => {
      return record.date >= startDate && record.date <= endDate;
    });
  },

  // 특정 날짜의 총 집중 시간 (초)
  getTotalFocusTime: (date) => {
    const records = get().getRecordsByDate(date);
    return records.reduce((sum, record) => sum + (record.focusedTime || 0), 0);
  },

  // 주간 집중 시간 (최근 7일)
  getWeeklyFocusTime: () => {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);

    const startDate = weekAgo.toISOString().split('T')[0];
    const endDate = today.toISOString().split('T')[0];

    const records = get().getRecordsByDateRange(startDate, endDate);
    return records.reduce((sum, record) => sum + (record.focusedTime || 0), 0);
  },

  // 월간 집중 시간 (현재 월)
  getMonthlyFocusTime: () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const prefix = `${year}-${month}`;

    const records = get().records.filter((record) => record.date.startsWith(prefix));
    return records.reduce((sum, record) => sum + (record.focusedTime || 0), 0);
  },

  // 모든 기록 삭제 (테스트용)
  clearAllRecords: async () => {
    try {
      await AsyncStorage.removeItem(FOCUS_RECORDS_KEY);
      set({ records: [] });
      if (__DEV__) {
        console.log('[FocusStore] Cleared all records');
      }
    } catch (error) {
      console.error('[FocusStore] Clear error:', error);
    }
  },
}));

export default useFocusStore;
