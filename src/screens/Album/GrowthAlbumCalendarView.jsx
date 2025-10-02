// src/screens/GrowthAlbumCalendarView.jsx

import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { format } from 'date-fns';
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import { useTranslation } from 'react-i18next';

LocaleConfig.locales['ko'] = { monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'], monthNamesShort: ['1.','2.','3.','4.','5.','6.','7.','8.','9.','10.','11.','12.'], dayNames: ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'], dayNamesShort: ['일','월','화','수','목','금','토'], today: '오늘' };
LocaleConfig.defaultLocale = 'ko';

const GrowthAlbumCalendarView = ({ photos }) => {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const markedDates = useMemo(() => {
    const marks = {};
    Object.keys(photos).forEach(dateString => {
      marks[dateString] = { marked: true, dotColor: Colors.accentApricot };
    });
    marks[selectedDate] = { ...marks[selectedDate], selected: true, selectedColor: Colors.accentApricot, disableTouchEvent: false };
    return marks;
  }, [photos, selectedDate]);

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const photosForSelectedDate = photos[selectedDate] || [];

  const renderPhotoItem = ({ item }) => (
    <TouchableOpacity style={styles.photoThumbnailContainer}>
      <Image source={{ uri: item.uri }} style={styles.photoThumbnail} />
      <Text style={styles.photoMemo} numberOfLines={1}>{item.memo}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Calendar onDayPress={onDayPress} markedDates={markedDates} style={styles.calendar} />
      <Text style={styles.selectedDateTitle}>{format(new Date(selectedDate), t('album.selected_date'))}</Text>
      {photosForSelectedDate.length > 0 ? (
        <FlatList data={photosForSelectedDate} renderItem={renderPhotoItem} keyExtractor={item => item.id} numColumns={3} contentContainerStyle={styles.photoGrid} />
      ) : (
        <View style={styles.noPhotoContainer}>
         <Text style={styles.noPhotoText}>{t('album.no_photos_selected')}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%', alignItems: 'center' },
  calendar: { width: '100%', borderRadius: 15, backgroundColor: Colors.textLight, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, marginBottom: 20 },
  selectedDateTitle: { fontSize: FontSizes.large, fontWeight: FontWeights.bold, color: Colors.textDark, marginBottom: 15 },
  photoGrid: { paddingHorizontal: '1.5%' },
  photoThumbnailContainer: { flex: 1 / 3, aspectRatio: 1, margin: '1.5%', borderRadius: 10, overflow: 'hidden', borderWidth: 1, borderColor: Colors.secondaryBrown + '80' },
  photoThumbnail: { width: '100%', height: '100%', resizeMode: 'cover' },
  photoMemo: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', color: Colors.textLight, fontSize: FontSizes.small - 2, paddingVertical: 3, textAlign: 'center' },
  noPhotoContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  noPhotoText: { fontSize: FontSizes.medium, color: Colors.secondaryBrown, textAlign: 'center' },
});

export default GrowthAlbumCalendarView;