// src/components/common/PremiumPreparingModal.jsx

import React from 'react';
<<<<<<< HEAD
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image } from 'react-native';
=======
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
>>>>>>> Ahyeon/main
import { useTranslation } from 'react-i18next';
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';

const PremiumPreparingModal = ({ visible, onClose }) => {
  const { t } = useTranslation();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
<<<<<<< HEAD
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* 오분이 이미지 */}
          <Image 
            source={require('../../../assets/기본오분이.png')}
            style={styles.characterImage}
            resizeMode="contain"
          />
          
          {/* 메시지 */}
          <Text style={styles.message}>
            {t('premium.preparing_message')}
          </Text>
        </View>
      </View>
=======
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modalContainer}>
              {/* 오분이 이미지 */}
              <Image
                source={require('../../../assets/기본오분이.png')}
                style={styles.characterImage}
                resizeMode="contain"
              />

              {/* 메시지 */}
              <Text style={styles.message}>
                {t('premium.preparing_message')}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
>>>>>>> Ahyeon/main
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
    maxWidth: 300,
    alignItems: 'center',
    shadowColor: '#000',
<<<<<<< HEAD
    shadowOffset: {
      width: 0,
      height: 2,
    },
=======
    shadowOffset: { width: 0, height: 2 },
>>>>>>> Ahyeon/main
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  characterImage: {
    width: 60,
    height: 60,
    marginBottom: 20,
  },
  message: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.medium,
    color: Colors.textDark,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default PremiumPreparingModal;
