// src/screens/Pomodoro/PomodoroStartConfirmModal.jsx

import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

// 공통 스타일 및 컴포넌트 임포트
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Button from '../../components/common/Button';
import CharacterImage from '../../components/common/CharacterImage';

const PomodoroStartConfirmModal = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { t } = useTranslation();
  
  const { goal, onConfirm, onCancel } = route.params;

  const handleConfirm = () => {
    navigation.goBack();
    setTimeout(() => {
      try { onConfirm && onConfirm(); } catch {}
    }, 100);
  };

  const handleCancel = () => {
    try { onCancel && onCancel(); } catch {}
    try { navigation.goBack(); } catch {}
  };

  const goalText = goal?.text || goal || t('pomodoro.study_mode');

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={true}
      onRequestClose={handleCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <CharacterImage style={styles.obooniImage} />
          <Text style={styles.titleText}>
            {t('pomodoro.start_pomodoro_title')}
          </Text>
          <Text style={styles.messageText}>
            "{goalText}" {t('pomodoro.start_message_suffix')}
          </Text>
          <View style={styles.buttonContainer}>
            <Button 
              title={t('common.cancel')} 
              onPress={handleCancel} 
              primary={false}
              style={styles.modalButton} 
            />
            <Button 
              title={t('common.ok')} 
              onPress={handleConfirm} 
              style={styles.modalButton} 
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(51, 51, 51, 0.7)',
  },
  modalContent: {
    backgroundColor: Colors.primaryBeige,
    borderRadius: 24,
    padding: 30,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
    borderWidth: 2,
    borderColor: Colors.secondaryBrown,
  },
  obooniImage: {
    width: 100,
    height: 100,
    marginBottom: 24,
  },
  titleText: {
    fontSize: FontSizes.extraLarge,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 16,
    textAlign: 'center',
  },
  messageText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  modalButton: {
    flex: 1,
  },
});

export default PomodoroStartConfirmModal;
