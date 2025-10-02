// src/screens/PhotoUploadModal.jsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Alert, Image, Pressable } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from 'react-i18next';

import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Button from '../../components/common/Button';

const PhotoUploadModal = ({ visible, onClose, onSave }) => {
  const { t } = useTranslation();
  const [memo, setMemo] = useState('');
  const [imageUri, setImageUri] = useState(null);

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t('album.need_permission_title'), t('album.need_camera'));
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.5 });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t('album.need_permission_title'), t('album.need_gallery'));
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 0.5 });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSavePhoto = () => {
    if (!imageUri) {
      Alert.alert(t('album.need_permission_title'), t('album.need_image'));
      return;
    }
    onSave({ uri: imageUri, memo });
    onClose();
  };

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modalContent}>
          <Text style={styles.modalTitle}>{t('album.upload_title')}</Text>
          <View style={styles.photoPreviewContainer}>
            {imageUri ? <Image source={{ uri: imageUri }} style={styles.photoPreview} /> : <Text style={styles.placeholderText}>{t('album.preview')}</Text>}
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.photoActionButton} onPress={takePhoto}>
              <FontAwesome5 name="camera" size={24} color={Colors.secondaryBrown} />
              <Text style={styles.photoActionButtonText}>{t('album.camera')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.photoActionButton} onPress={pickImage}>
              <FontAwesome5 name="images" size={24} color={Colors.secondaryBrown} />
              <Text style={styles.photoActionButtonText}>{t('album.gallery')}</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.memoInput}
            placeholder={t('album.memo_placeholder')}
            placeholderTextColor={Colors.secondaryBrown}
            value={memo}
            onChangeText={setMemo}
          />
          <View style={styles.actionButtonContainer}>
            <Button title={t('album.cancel')} onPress={onClose} primary={false} style={styles.actionButton} />
            <Button title={t('album.save')} onPress={handleSavePhoto} style={styles.actionButton} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.6)' },
  modalContent: { backgroundColor: Colors.textLight, borderRadius: 20, padding: 25, width: '90%', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 10 },
  modalTitle: { fontSize: FontSizes.large, fontWeight: FontWeights.bold, color: Colors.textDark, marginBottom: 20, textAlign: 'center' },
  photoPreviewContainer: { width: '100%', height: 180, backgroundColor: Colors.primaryBeige, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 20, overflow: 'hidden' },
  photoPreview: { width: '100%', height: '100%', resizeMode: 'cover' },
  placeholderText: { fontSize: FontSizes.medium, color: Colors.secondaryBrown },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: 20 },
  photoActionButton: { backgroundColor: Colors.primaryBeige, paddingVertical: 10, paddingHorizontal: 15, borderRadius: 10, alignItems: 'center', width: '48%', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  photoActionButtonText: { fontSize: FontSizes.small, color: Colors.textDark, marginTop: 5, textAlign: 'center' },
  memoInput: { width: '100%', backgroundColor: Colors.primaryBeige, borderRadius: 10, padding: 15, fontSize: FontSizes.medium, color: Colors.textDark, height: 80, textAlignVertical: 'top', marginBottom: 20, borderWidth: 1, borderColor: Colors.secondaryBrown },
  actionButtonContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
  actionButton: { flex: 1, marginHorizontal: 5 },
});

export default PhotoUploadModal;