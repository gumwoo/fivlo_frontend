// src/screens/Task/AlbumPhotoPromptModal.jsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image, TextInput, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';

import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';

const AlbumPhotoPromptModal = ({ visible, onClose, onSave }) => {
  const { t } = useTranslation();
  const [imageUri, setImageUri] = useState(null);
  const [videoUri, setVideoUri] = useState(null);
  const [memo, setMemo] = useState('');
  const [showMemoInput, setShowMemoInput] = useState(false);

  // 갤러리에서 사진 선택
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t('album.need_permission_title'), t('album.need_gallery'));
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setVideoUri(null);
    }
  };

  // 갤러리에서 동영상 선택
  const pickVideo = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t('album.need_permission_title'), t('album.need_gallery'));
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setVideoUri(result.assets[0].uri);
      setImageUri(null);
    }
  };

  // 저장하기
  const handleSave = () => {
    if (!imageUri && !videoUri) {
      Alert.alert(t('album.need_permission_title'), t('album.need_image'));
      return;
    }
    onSave({ 
      uri: imageUri || videoUri, 
      memo, 
      type: imageUri ? 'image' : 'video' 
    });
    // 초기화
    setImageUri(null);
    setVideoUri(null);
    setMemo('');
    setShowMemoInput(false);
    onClose();
  };

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* 상단 텍스트 */}
          <Text style={styles.title}>
            {t('album.congratulations', '축하합니다! 오늘 목표를 완료했어요.')}
          </Text>
          <Text style={styles.title}>
            {t('album.record_moment', '지금 이 순간을 사진으로 남겨볼까요?')}
          </Text>

          {/* 사진/동영상 미리보기 또는 아이콘 */}
          {imageUri || videoUri ? (
            <View style={styles.panel}>
              {imageUri && (
                <Image source={{ uri: imageUri }} style={styles.previewImage} />
              )}
              {videoUri && (
                <View style={styles.videoPreview}>
                  <FontAwesome5 name="video" size={60} color={Colors.textDark} />
                  <Text style={styles.videoText}>동영상 선택됨</Text>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.panel}>
              <Text style={styles.panelGuide}>
                {t('album.photo_or_video', '사진을 업로드하거나\\n클릭해서 촬영하세요')}
              </Text>
          
              <View style={styles.iconRow}>
                <TouchableOpacity style={styles.iconTap} onPress={pickImage} activeOpacity={0.8}>
                  <FontAwesome5 name="image" size={65} color={Colors.textDark} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconTap} onPress={pickVideo} activeOpacity={0.8}>
                  <FontAwesome5 name="video" size={65} color={Colors.textDark} />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* 메모 입력창 또는 플레이스홀더 */}
          {showMemoInput ? (
            <TextInput
              style={styles.memoInput}
              placeholder={t('album.memo_placeholder')}
              placeholderTextColor="#9A9A9A"
              value={memo}
              onChangeText={setMemo}
              multiline
            />
          ) : (
            <TouchableOpacity 
              style={[styles.panel, styles.placeholderPanel]} 
              onPress={() => setShowMemoInput(true)}
            >
              <Text style={styles.placeholderText}>
                {t('album.record_today', '오늘의 순간을 기록해보세요!')}
              </Text>
            </TouchableOpacity>
          )}

          {/* 저장 버튼 */}
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.9}>
            <Text style={styles.saveBtnText}>{t('album.save_button', '저장하기')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const RADIUS = 16;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 바깥 큰 카드(시안의 베이지 카드)
  modalCard: {
    width: '85%',
    backgroundColor: Colors.primaryBeige,
    borderRadius: 25,
    paddingVertical: 30,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
    alignItems: 'center',
  },

  title: {
    fontSize: FontSizes.medium,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 6,
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: 14,
  },

  // 공통 하얀 패널
  panel: {
    width: '100%',
    backgroundColor: Colors.textLight,   // 하얀색
    borderRadius: RADIUS,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
    alignItems: 'center',
  },

  panelGuide: {
    textAlign: 'center',
    color: Colors.textDark,
    fontSize: FontSizes.small + 1,
    lineHeight: 20,
    marginBottom: 10,
  },

  iconRow: {
    flexDirection: 'row',
    gap: 30,
    paddingVertical: 20,
  },
  iconTap: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.0)', // 살짝 음영
  },

  // 두 번째 패널(회색 플레이스홀더 느낌)
  placeholderPanel: {
    backgroundColor: Colors.textLight,
    paddingHorizontal: 50,
  },
  placeholderText: {
    color: '#9A9A9A',
    fontSize: FontSizes.small + 4,
  },

  memoInput: {
    width: '100%',
    backgroundColor: Colors.textLight,
    borderRadius: RADIUS,
    padding: 15,
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    minHeight: 80,
    textAlignVertical: 'top',
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },

  previewImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: RADIUS,
  },

  videoPreview: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
  },

  videoText: {
    marginTop: 10,
    fontSize: FontSizes.small,
    color: Colors.textDark,
  },

  saveBtn: {
    marginTop: 16,
    backgroundColor: Colors.textDark,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 70,
    alignSelf: 'center',
  },
  saveBtnText: {
    color: Colors.textLight,
    fontWeight: FontWeights.bold,
    fontSize: FontSizes.medium,
  },
});

export default AlbumPhotoPromptModal;
