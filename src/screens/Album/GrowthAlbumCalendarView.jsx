// src/screens/Album/GrowthAlbumCalendarView.jsx

import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { format } from 'date-fns';
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import { useTranslation } from 'react-i18next';
import useAlbumStore from '../../store/albumStore';
import PhotoDetailModal from './PhotoDetailModal';
import { Video } from 'expo-av';

// --- 화면 너비에 맞춰 동적으로 크기 계산 ---
const { width: screenWidth } = Dimensions.get('window');
const calendarHorizontalPadding = 15; // 캘린더 좌우 전체 여백
const calendarWidth = screenWidth - (calendarHorizontalPadding * 2);
const dayCellMargin = 3; // 날짜 셀 사이의 간격
const dayCellWidth = (calendarWidth / 7) - (dayCellMargin * 2);

// 한국어 달력 설정
LocaleConfig.locales['ko'] = {
  monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
  monthNamesShort: ['1.','2.','3.','4.','5.','6.','7.','8.','9.','10.','11.','12.'],
  dayNames: ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'],
  dayNamesShort: ['일','월','화','수','목','금','토'],
  today: '오늘',
};
LocaleConfig.defaultLocale = 'ko';

const GrowthAlbumCalendarView = ({ photos }) => {
  const { t } = useTranslation();
  const deletePhoto = useAlbumStore((state) => state.deletePhoto);
  const updatePhoto = useAlbumStore((state) => state.updatePhoto);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const markedDates = useMemo(() => {
    const marks = {};
    Object.keys(photos).forEach((dateString) => {
      marks[dateString] = { marked: true };
    });
    marks[selectedDate] = { ...marks[selectedDate], selected: true, selectedColor: Colors.accentApricot };
    return marks;
  }, [photos, selectedDate]);

  const onDayPress = (day) => setSelectedDate(day.dateString);

  const handlePhotoPress = (photo, date) => {
    setSelectedPhoto(photo);
    setSelectedDate(date);
    setIsModalVisible(true);
  };

  const handleDelete = (photoId) => {
    if (selectedDate) {
      deletePhoto(selectedDate, photoId);
      setIsModalVisible(false);
    }
  };

  const handleEdit = (photoId, newMemo) => {
    if (selectedDate) {
      updatePhoto(selectedDate, photoId, { memo: newMemo });
    }
  };

  const renderDay = ({ date, state }) => {
    const dateString = date.dateString;
    const dayPhotos = photos[dateString] || [];
    const isSelected = dateString === selectedDate;
    const isDisabled = state === 'disabled';

    return (
      <TouchableOpacity style={styles.dayContainer} onPress={() => !isDisabled && onDayPress(date)} disabled={isDisabled}>
        {dayPhotos.length > 0 ? (
          <TouchableOpacity style={styles.fullDayImageContainer} onPress={() => handlePhotoPress(dayPhotos[0], dateString)}>
            {dayPhotos[0].type === 'video' ? (
              <Video source={{ uri: dayPhotos[0].uri }} style={styles.fullDayImage} resizeMode="cover" shouldPlay={false} isLooping={false} useNativeControls={false} />
            ) : (
              <Image source={{ uri: dayPhotos[0].uri }} style={styles.fullDayImage} />
            )}
          </TouchableOpacity>
        ) : (
          <Text style={[styles.dayText, isSelected && styles.dayTextSelected, isDisabled && styles.dayTextDisabled]}>{date.day}</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={onDayPress}
        markedDates={markedDates}
        style={styles.calendar}
        dayComponent={renderDay}
        theme={{
          monthTextColor: Colors.textDark,
          textMonthFontSize: FontSizes.large,
          textMonthFontWeight: FontWeights.bold,
          textSectionTitleColor: Colors.secondaryBrown,
          textDayHeaderFontSize: FontSizes.small,
          arrowColor: Colors.secondaryBrown,
          todayTextColor: Colors.accentApricot,
        }}
      />
      <PhotoDetailModal visible={isModalVisible} photo={selectedPhoto} date={selectedDate} onClose={() => setIsModalVisible(false)} onDelete={handleDelete} onEdit={handleEdit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: calendarHorizontalPadding,
  },
  calendar: {
    width: '100%',
    backgroundColor: Colors.textLight,
    borderRadius: 15,
    paddingBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dayContainer: {
    width: dayCellWidth,
    height: dayCellWidth + 20, // 가로세로 비율 조정
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: dayCellMargin,
  },
  dayText: {
    fontSize: FontSizes.small, // 폰트 크기 원복
    color: Colors.textDark,
    fontWeight: FontWeights.medium,
  },
  dayTextSelected: {
    color: Colors.accentApricot,
    fontWeight: FontWeights.bold,
  },
  dayTextDisabled: {
    color: '#d9e1e8',
  },
  fullDayImageContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    overflow: 'hidden',
  },
  fullDayImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export default GrowthAlbumCalendarView;