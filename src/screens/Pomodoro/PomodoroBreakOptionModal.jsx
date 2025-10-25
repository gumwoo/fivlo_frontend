// src/screens/Pomodoro/PomodoroBreakOptionModal.jsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

// 공통 스타일 및 컴포넌트 임포트
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Button from '../../components/common/Button';
import CharacterImage from '../../components/common/CharacterImage';

const PomodoroBreakOptionModal = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [countdown, setCountdown] = useState(3);

  const { onContinue, onBreak } = route.params;

  // ✅ 수정된 함수: 부모 콜백만 실행 (goBack 제거)
  const handleContinue = () => {
    try {
      onContinue && onContinue(); // 부모 로직 실행
    } catch (e) {
      console.warn('onContinue error:', e);
    }
  };
  
  const handleBreak = () => {
    try {
      onBreak && onBreak(); // 부모 로직 실행
    } catch (e) {
      console.warn('onBreak error:', e);
    }
  };

  // ✅ 안전한 타이머 (언마운트 방지 포함)
  useEffect(() => {
    let mounted = true;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (!mounted) return prev;
        if (prev <= 1) {
          clearInterval(timer);
          setTimeout(handleContinue, 0); // 즉시가 아닌 다음 tick에서 실행
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, []);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={true}
      onRequestClose={handleBreak}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <CharacterImage style={styles.obooniImage} />
          <Text style={styles.questionText}>
            휴식시간 없이 바로{'\n'}시이클을 진행하시겠어요?
          </Text>
          <View style={styles.buttonContainer}>
            <Button title="네" onPress={handleContinue} style={styles.modalButton} />
            <Button
              title="아니오"
              onPress={handleBreak}
              primary={false}
              style={styles.modalButton}
            />
          </View>
          <Text style={styles.countdownText}>
            {countdown}초가 지나면 '네' 로 진행합니다.
          </Text>
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
    marginBottom: 16,
    gap: 12,
  },
  modalButton: {
    flex: 1,
  },
  countdownText: {
    fontSize: FontSizes.small,
    color: Colors.secondaryBrown,
    textAlign: 'center',
    fontWeight: FontWeights.medium,
  },
});

export default PomodoroBreakOptionModal;
