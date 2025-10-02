// src/screens/TaskCompleteCoinModal.jsx

import React from 'react';
import { View, Text, StyleSheet, Modal, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

// 공통 스타일 및 컴포넌트 임포트
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Button from '../../components/common/Button';
import { useTranslation } from 'react-i18next';

const TaskCompleteCoinModal = ({ isVisible, onClose, taskText, earnedCoins = 10 }) => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* 오분이 캐릭터 */}
          <Image source={require('../../../assets/기본오분이.png')} style={styles.obooniImage} />
          
          {/* 완료 메시지 */}
          <Text style={styles.completeMessage}>
            {t('task_complete.complete_message', { taskText })}
          </Text>
          
          {/* 코인 지급 */}
          <View style={styles.coinContainer}>
            <Image source={require('../../../assets/coin.png')} style={styles.coinImage} />
            <Text style={styles.coinText}>+{earnedCoins}</Text>
          </View>
          
          <Text style={styles.encourageMessage}>
            {t('task_complete.encourage_message')}
          </Text>
          
          <Button title={t('task_complete.confirm')} onPress={onClose} style={styles.confirmButton} />
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // 불투명 배경
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
    marginBottom: 15,
    resizeMode: 'contain',
  },
  completeMessage: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: 20,
  },
  coinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  coinImage: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  coinText: {
    fontSize: FontSizes.extraLarge,
    fontWeight: FontWeights.bold,
    color: Colors.accentApricot,
  },
  encourageMessage: {
    fontSize: FontSizes.medium,
    color: Colors.secondaryBrown,
    textAlign: 'center',
    marginBottom: 25,
  },
  confirmButton: {
    width: '70%',
  },
});

export default TaskCompleteCoinModal;
