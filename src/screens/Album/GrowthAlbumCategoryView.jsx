// src/screens/GrowthAlbumCategoryView.jsx

import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import { useTranslation } from 'react-i18next';
import useAlbumStore from '../../store/albumStore';
import PhotoDetailModal from './PhotoDetailModal';

const GrowthAlbumCategoryView = ({ photos }) => {
  const { t } = useTranslation();
  const deletePhoto = useAlbumStore((state) => state.deletePhoto);
  const updatePhoto = useAlbumStore((state) => state.updatePhoto);
  
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const photosByCategory = useMemo(() => {
    const categoryMap = { 'daily': [] };
    Object.entries(photos).forEach(([date, photoList]) => {
      photoList.forEach(photo => {
        const categoryKey = photo.categoryKey || 'daily';
        if (!categoryMap[categoryKey]) {
          categoryMap[categoryKey] = [];
        }
        categoryMap[categoryKey].push({ ...photo, date });
      });
    });
    return categoryMap;
  }, [photos]);

  const categories = Object.keys(photosByCategory)
    .filter(key => photosByCategory[key].length > 0)
    .map(key => ({ key, photos: photosByCategory[key] }));

  const handlePhotoPress = (photo) => {
    setSelectedPhoto(photo);
    setSelectedDate(photo.date);
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

  const renderPhotoThumbnail = ({ item }) => (
    <TouchableOpacity 
      style={styles.photoThumbnailContainer}
      onPress={() => handlePhotoPress(item)}
    >
      <Image source={{ uri: item.uri }} style={styles.photoThumbnail} />
      <Text style={styles.photoMemo} numberOfLines={1}>{item.memo}</Text>
    </TouchableOpacity>
  );

  const renderCategorySection = ({ item: category }) => (
    <View style={styles.categorySection}>
      <View style={styles.categoryHeader}>
        <Text style={styles.categoryTitle}>
          {t(`album.categories.${category.key}`, category.key.toUpperCase())}
        </Text>
      </View>
      <FlatList
        data={category.photos}
        renderItem={renderPhotoThumbnail}
        keyExtractor={photo => photo.id}
        numColumns={3}
        contentContainerStyle={styles.photoGrid}
        scrollEnabled={false}
      />
    </View>
  );
  
  if (categories.length === 0) {
      return (
        <View style={styles.noPhotoContainer}>
         <Text style={styles.noPhotoText}>{t('album.no_photos_in_category')}</Text>
        </View>
      )
  }

  return (
    <>
      <FlatList
        data={categories}
        renderItem={renderCategorySection}
        keyExtractor={item => item.key}
        style={styles.container}
      />
      
      <PhotoDetailModal
        visible={isModalVisible}
        photo={selectedPhoto}
        date={selectedDate}
        onClose={() => setIsModalVisible(false)}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%' },
  categorySection: { marginBottom: 20, backgroundColor: Colors.textLight, borderRadius: 15, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, marginHorizontal: 5 },
  categoryHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: 12, 
    paddingHorizontal: 15, 
    backgroundColor: Colors.primaryBeige 
  },
  categoryTitle: { fontSize: FontSizes.large, fontWeight: FontWeights.bold, color: Colors.textDark },
  photoGrid: { padding: 5 },
  photoThumbnailContainer: { flex: 1/3, aspectRatio: 1, margin: 5, borderRadius: 10, overflow: 'hidden', borderWidth: 1, borderColor: Colors.secondaryBrown + '80' },
  photoThumbnail: { width: '100%', height: '100%', resizeMode: 'cover' },
  photoMemo: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', color: Colors.textLight, fontSize: FontSizes.small - 2, paddingVertical: 3, textAlign: 'center' },
  noPhotoContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 50 },
  noPhotoText: { fontSize: FontSizes.medium, color: Colors.secondaryBrown, textAlign: 'center' },
});

export default GrowthAlbumCategoryView;