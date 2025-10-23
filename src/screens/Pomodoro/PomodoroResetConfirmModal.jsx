// src/screens/Pomodoro/PomodoroResetConfirmModal.jsx

import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

// 공통 스타일 및 컴포넌트 임포트
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Button from '../../components/common/Button';
import CharacterImage from '../../components/common/CharacterImage';

const PomodoroResetConfirmModal = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { t } = useTranslation();
  
  // --- 수정: useEffect를 제거하고 route.params에서 직접 함수를 가져옵니다 ---
  const { onConfirm, onCancel } = route.params;

  const handleConfirm = () => {
    // 모달 먼저 닫고
    navigation.goBack();
    // onConfirm 실행
    setTimeout(() => {
      try { onConfirm && onConfirm(); } catch {}
    }, 100);
  };

  const handleCancel = () => {
    try { onCancel && onCancel(); } catch {}
    try { navigation.goBack(); } catch {}
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
    backgroundColor: 'rgba(51, 51, 51, 0.7)', // 더 진한 오버레이
  },
  modalContent: {
    backgroundColor: Colors.primaryBeige, // 베이지 배경
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
    borderColor: Colors.secondaryBrown, // 브라운 테두리
  },
  obooniImage: {
    width: 100,
    height: 100,
    marginBottom: 24,
  },
  questionText: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 30,
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

export default PomodoroResetConfirmModal;
