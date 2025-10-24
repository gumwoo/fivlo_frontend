// src/utils/timeFormat.js

/**
 * 분을 "X시간 Y분" 형식으로 변환
 * @param {number} minutes - 총 분
 * @returns {string} - "2시간 30분" 형식
 */
export const formatTime = (minutes) => {
  if (!minutes || minutes === 0) {
    return '0분';
  }

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) {
    return `${mins}분`;
  }

  if (mins === 0) {
    return `${hours}시간`;
  }

  return `${hours}시간 ${mins}분`;
};

/**
 * 초를 "X시간 Y분" 형식으로 변환
 * @param {number} seconds - 총 초
 * @returns {string} - "2시간 30분" 형식
 */
export const formatTimeFromSeconds = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  return formatTime(minutes);
};
