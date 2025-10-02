// src/screens/GrowthAlbumScreen.jsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

import Header from '../../components/common/Header';
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import PhotoUploadModal from './PhotoUploadModal';
import GrowthAlbumCalendarView from './GrowthAlbumCalendarView';
import GrowthAlbumCategoryView from './GrowthAlbumCategoryView';

const initialMockPhotos = {
  '2025-09-20': [
    { id: 'p1', uri: 'https://placehold.co/100x100/FFD1DC/000000?text=운동', memo: '오전 운동 후', categoryKey: 'exercise' },
    { id: 'p2', uri: 'https://placehold.co/100x100/99DDFF/000000?text=개발', memo: 'FIVLO 개발 중', categoryKey: 'study' },
  ],
  '2025-09-21': [
    { id: 'p3', uri: 'https://placehold.co/100x100/FFABAB/000000?text=식사', memo: '건강한 점심', categoryKey: 'daily' },
  ],
};

const GrowthAlbumScreen = () => {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [activeView, setActiveView] = useState('calendar');
  const [isPhotoModalVisible, setIsPhotoModalVisible] = useState(false);
  const [photos, setPhotos] = useState(initialMockPhotos);

  const handleSavePhoto = (newPhoto) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const newPhotoWithId = { ...newPhoto, id: `photo-${Date.now()}`, categoryKey: 'exercise' };

    setPhotos(prevPhotos => {
      const todayPhotos = prevPhotos[today] || [];
      return { ...prevPhotos, [today]: [...todayPhotos, newPhotoWithId] };
    });
  };

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top + 20 }]}>
      <Header title={t('album.header')} showBackButton={true} />

      <View style={styles.contentContainer}>
        <View style={styles.viewToggleContainer}>
          <TouchableOpacity
            style={[styles.viewToggleButton, activeView === 'calendar' && styles.viewToggleButtonActive]}
            onPress={() => setActiveView('calendar')}
          >
            <Text style={[styles.viewButtonText, activeView === 'calendar' && styles.viewButtonTextActive]}>{t('album.tab_calendar')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewToggleButton, activeView === 'category' && styles.viewToggleButtonActive]}
            onPress={() => setActiveView('category')}
          >
            <Text style={[styles.viewButtonText, activeView === 'category' && styles.viewButtonTextActive]}>{t('album.tab_category')}</Text>
          </TouchableOpacity>
        </View>

        {activeView === 'calendar' ? (
          <GrowthAlbumCalendarView photos={photos} />
        ) : (
          <GrowthAlbumCategoryView photos={photos} />
        )}
        
        <TouchableOpacity style={styles.testPhotoButton} onPress={() => setIsPhotoModalVisible(true)}>
          <Text style={styles.testPhotoButtonText}>{t('album.test_upload')}</Text>
        </TouchableOpacity>
      </View>

      {isPhotoModalVisible && (
        <PhotoUploadModal 
          visible={isPhotoModalVisible}
          onClose={() => setIsPhotoModalVisible(false)} 
          onSave={handleSavePhoto} 
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: Colors.primaryBeige },
  contentContainer: { flex: 1, alignItems: 'center', paddingTop: 10 },
  viewToggleContainer: { flexDirection: 'row', backgroundColor: Colors.textLight, borderRadius: 15, marginBottom: 20, width: '95%', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  viewToggleButton: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 15 },
  viewToggleButtonActive: { backgroundColor: Colors.accentApricot },
  viewButtonText: { fontSize: FontSizes.medium, color: Colors.secondaryBrown, fontWeight: FontWeights.medium },
  viewButtonTextActive: { color: Colors.textLight, fontWeight: FontWeights.bold },
  testPhotoButton: { position: 'absolute', bottom: 20, right: 20, backgroundColor: Colors.accentApricot, padding: 15, borderRadius: 30, elevation: 5 },
  testPhotoButtonText: { color: Colors.textLight, fontSize: FontSizes.small, fontWeight: FontWeights.bold },
});

export default GrowthAlbumScreen;