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

  // ✅ 수정된 함수: 부모 콜백 실행 → navigation.goBack() 순서
  const handleContinue = () => {
    setTimeout(() => {
      try {
        onContinue && onContinue(); // 부모 로직 먼저 실행
      } catch (e) {
        console.warn('onContinue error:', e);
      }
      navigation.goBack(); // 그 다음 모달 닫기
    }, 100);
  };

  const handleBreak = () => {
    setTimeout(() => {
      try {
        onBreak && onBreak(); // 부모 로직 먼저 실행
      } catch (e) {
        console.warn('onBreak error:', e);
      }
      navigation.goBack(); // 그 다음 모달 닫기
    }, 100);
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
    width: 80,
    height: 80,
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
    marginBottom: 15,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  countdownText: {
    fontSize: FontSizes.small,
    color: Colors.secondaryBrown,
    textAlign: 'center',
  },
});

export default PomodoroBreakOptionModal;
