// src/screens/Album/PhotoDetailModal.jsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import { Video } from 'expo-av';

const PhotoDetailModal = ({
  visible,
  photo,
  date,
  onClose,
  onDelete,
  onEdit,
}) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [memo, setMemo] = useState(photo?.memo || '');

  if (!photo) return null;

  const handleEdit = () => {
    if (isEditing) {
      onEdit(photo.id, memo);
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleDelete = () => {
    onDelete(photo.id);
    onClose();
  };

  const formattedDate = date ? format(new Date(date), 'MMMM do') : '';

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modalContent}>
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* 날짜 */}
                <Text style={styles.dateText}>{formattedDate}</Text>

                {/* 사진 또는 동영상 */}
                <View style={styles.imageContainer}>
                  {photo.type === 'video' ? (
                    <Video
                      source={{ uri: photo.uri }}
                      style={styles.media}
                      useNativeControls
                      resizeMode="contain"
                      isLooping
                    />
                  ) : (
                    <Image source={{ uri: photo.uri }} style={styles.media} />
                  )}
                </View>

                {/* MEMO 섹션 */}
                <View style={styles.memoSection}>
                  <Text style={styles.memoLabel}>MEMO</Text>
                  {isEditing ? (
                    <TextInput
                      style={styles.memoInput}
                      value={memo}
                      onChangeText={setMemo}
                      multiline
                      placeholder={t('album.memo_placeholder')}
                      placeholderTextColor={Colors.secondaryBrown}
                    />
                  ) : (
                    <Text style={styles.memoText}>
                      {photo.memo || t('album.no_memo')}
                    </Text>
                  )}
                </View>

                {/* 버튼들 */}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.button, styles.deleteButton]}
                    onPress={handleDelete}
                  >
                    <Text style={styles.buttonText}>삭제</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.button, styles.editButton]}
                    onPress={handleEdit}
                  >
                    <Text style={styles.buttonText}>
                      {isEditing ? '저장' : '수정'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.button, styles.confirmButton]}
                    onPress={onClose}
                  >
                    <Text style={styles.buttonText}>확인</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.textLight,
    borderRadius: 20,
    padding: 20,
    width: '85%',
    maxHeight: '80%',
  },
  dateText: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: 15,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
  },
  media: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  memoSection: {
    backgroundColor: Colors.primaryBeige,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  memoLabel: {
    fontSize: FontSizes.medium,
    fontWeight: FontWeights.bold,
    color: Colors.secondaryBrown,
    marginBottom: 10,
  },
  memoText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    lineHeight: 22,
  },
  memoInput: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: Colors.primaryBeige,
  },
  editButton: {
    backgroundColor: Colors.secondaryBrown,
  },
  confirmButton: {
    backgroundColor: Colors.textDark,
  },
  buttonText: {
    color: Colors.textLight,
    fontSize: FontSizes.medium,
    fontWeight: FontWeights.bold,
  },
});

export default PhotoDetailModal;
