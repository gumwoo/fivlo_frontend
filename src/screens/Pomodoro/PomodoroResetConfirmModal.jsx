// src/screens/Pomodoro/PomodoroResetConfirmModal.jsx

import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

// 공통 스타일 및 컴포넌트 임포트
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Button from '../../components/common/Button';
import CharacterImage from '../../components/common/CharacterImage';

const PomodoroResetConfirmModal = () => {
  const route = useRoute();
  const { t } = useTranslation();
  
  // --- 수정: useEffect를 제거하고 route.params에서 직접 함수를 가져옵니다 ---
  const { onConfirm, onCancel } = route.params;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

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
          <Text style={styles.questionText}>
            {t('pomodoro.reset_confirm_question')}
          </Text>
          <View style={styles.buttonContainer}>
            <Button title={t('pomodoro.yes')} onPress={handleConfirm} style={styles.modalButton} />
            <Button title={t('pomodoro.no')} onPress={handleCancel} primary={false} style={styles.modalButton} />
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    backgroundColor: Colors.textLight,
    borderRadius: 20,
    padding: 25,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  obooniImage: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  questionText: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 28,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default PomodoroResetConfirmModal;