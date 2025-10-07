// src/store/albumStore.js

import { create } from 'zustand';

const useAlbumStore = create((set) => ({
  // photos 데이터: { '2025-10-09': [{ id, uri, memo, categoryKey }] }
  photos: {},

  // 사진 추가
  addPhoto: (date, photo) => set((state) => ({
    photos: {
      ...state.photos,
      [date]: [...(state.photos[date] || []), photo]
    }
  })),

  // 사진 삭제
  deletePhoto: (date, photoId) => set((state) => ({
    photos: {
      ...state.photos,
      [date]: (state.photos[date] || []).filter(p => p.id !== photoId)
    }
  })),

  // 사진 수정 (메모 업데이트)
  updatePhoto: (date, photoId, updates) => set((state) => ({
    photos: {
      ...state.photos,
      [date]: (state.photos[date] || []).map(p => 
        p.id === photoId ? { ...p, ...updates } : p
      )
    }
  })),

  // 초기 데이터 설정 (테스트용)
  setInitialPhotos: (initialPhotos) => set({ photos: initialPhotos }),
}));

export default useAlbumStore;
