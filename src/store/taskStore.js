// src/store/taskStore.js

import { create } from 'zustand';

// 기본 예시 데이터 – 필요에 따라 수정/삭제하세요.
const defaultTasks = {
  '2025-10-09': [
    { id: 'a1', text: '장보기 준비', color: '#E9C39B', completed: false, isAlbumLinked: false, categoryKey: 'daily' },
    { id: 'a2', text: '우유구매 #2', color: '#F4C16E', completed: false, isAlbumLinked: true, categoryKey: 'daily' },
    { id: 'a3', text: '미팅 준비', color: '#C3A0FF', completed: false, isAlbumLinked: false, categoryKey: 'work' },
    { id: 'a4', text: '개발 진행', color: '#8EA1FF', completed: false, isAlbumLinked: true, categoryKey: 'study' },
  ],
  '2025-10-16': [
    { id: 'b1', text: '프로젝트 마감', color: '#FFABAB', completed: false, isAlbumLinked: true, categoryKey: 'work' },
    { id: 'b2', text: '운동하기', color: '#A0FFC3', completed: false, isAlbumLinked: true, categoryKey: 'exercise' },
  ],
};

const useTaskStore = create((set) => ({
  tasks: defaultTasks,

  // 특정 날짜의 특정 task 업데이트
  updateTask: (dateString, taskId, updates) => set((state) => ({
    tasks: {
      ...state.tasks,
      [dateString]: (state.tasks[dateString] || []).map((task) =>
        task.id === taskId ? { ...task, ...updates } : task
      ),
    },
  })),

  // 새 task 추가 (필요시 사용)
  addTask: (dateString, newTask) =>
    set((state) => ({
      tasks: {
        ...state.tasks,
        [dateString]: [...(state.tasks[dateString] || []), newTask],
      },
    })),

  // 초기 데이터 덮어쓰기 (외부 로딩용)
  setInitialTasks: (initialTasks) => set({ tasks: initialTasks }),
}));

export default useTaskStore;
