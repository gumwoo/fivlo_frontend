// src/components/common/AccountDeleteModal.jsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
  import { useTranslation } from 'react-i18next';
  import { Colors } from '../../styles/color';
  import { FontSizes, FontWeights } from '../../styles/Fonts';

const AccountDeleteModal = ({ visible, onCancel, onConfirm }) => {
  const { t } = useTranslation();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modalContainer}>
              {/* 오분이 이미지 */}
              <Image
                source={require('../../../assets/놀란 오분이.png')}
                style={styles.characterImage}
                resizeMode="contain"
              />

              {/* 제목 */}
              <Text style={styles.title}>
                {t('account.delete_confirm_title')}
              </Text>

              {/* 메시지 */}
              <Text style={styles.message}>
                {t('account.delete_confirm_message')}
              </Text>

              {/* 부제목 */}
              <Text style={styles.subMessage}>
                {t('account.delete_confirm_submessage')}
              </Text>

              {/* 버튼 컨테이너 */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={onCancel}
                >
                  <Text style={styles.cancelButtonText}>
                    {t('account.cancel')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={onConfirm}
                >
                  <Text style={styles.deleteButtonText}>
                    {t('account.delete')}
                  </Text>
                </TouchableOpacity>
              </View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: Colors.textLight,
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 25,
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  characterImage: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 24,
  },
  message: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 20,
  },
  subMessage: {
    fontSize: FontSizes.medium,
    color: Colors.secondaryBrown,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: 15,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.textLight,
    borderWidth: 1,
    borderColor: Colors.secondaryBrown,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: FontSizes.medium,
    color: Colors.accentRed,
    fontWeight: FontWeights.medium,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: Colors.textLight,
    borderWidth: 1,
    borderColor: Colors.secondaryBrown,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    fontWeight: FontWeights.medium,
  },
});

export default AccountDeleteModal;
