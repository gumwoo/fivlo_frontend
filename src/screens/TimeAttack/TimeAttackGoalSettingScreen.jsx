// src/screens/TimeAttack/TimeAttackGoalSettingScreen.jsx

import React, { useState } from 'react';
// Modal, TouchableOpacity를 import에 추가합니다.
import { View, Text, StyleSheet, Alert, Modal, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import { useTranslation } from 'react-i18next';
import TimePicker from '../../components/common/TimePicker'; // 기존 TimePicker 컴포넌트 사용

const TimeAttackGoalSettingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { selectedGoal } = route.params;

  // 1. 초기 시간을 0으로 설정합니다.
  const [time, setTime] = useState({ h: 0, m: 0, s: 0 });
  // 2. 모달창의 노출 여부를 관리할 state를 추가합니다.
  const [isModalVisible, setIsModalVisible] = useState(false);
  // 3. 모달 내에서 임시로 시간을 저장할 state를 추가합니다.
  const [tempTime, setTempTime] = useState(time);

  const totalSeconds = time.h * 3600 + time.m * 60 + time.s;
  const totalMinutes = Math.floor(totalSeconds / 60);

  const formatTimeForDisplay = () => {
    // 1분 미만은 버리는 로직 대신, 초 단위도 표시하도록 수정 (디자인과 유사하게)
    const displayMinutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const displaySeconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${displayMinutes}:${displaySeconds}`;
  };

  // 모달 관련 함수
  const handleOpenModal = () => {
    setTempTime(time); // 모달을 열 때 현재 시간으로 임시 시간 설정
    setIsModalVisible(true);
  };

  const handleConfirmTime = () => {
    setTime(tempTime); // '저장' 버튼을 누르면 임시 시간을 실제 시간으로 적용
    setIsModalVisible(false);
  };

  const handleCancelTime = () => {
    setIsModalVisible(false); // '취소' 버튼을 누르면 변경사항 없이 모달 닫기
  };

  const handleStartAttack = () => {
    if (totalSeconds < 60) { // 1분 미만은 시작 불가
      Alert.alert(t('common.alert'), t('time_attack.invalid_minutes_message'));
      return;
    }
    navigation.navigate('TimeAttackAISubdivisionScreen', { selectedGoal, totalMinutes });
  };

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top }]}>
      <Header title={t('headers.time_attack')} showBackButton={true} />
      <View style={styles.content}>
        <Text style={styles.questionText}>{t('time_attack.question_time')}</Text>
        {/* 4. 시간 표시 영역을 TouchableOpacity로 감싸 모달을 열도록 합니다. */}
        <TouchableOpacity style={styles.timerDisplayContainer} onPress={handleOpenModal}>
          <Text style={styles.timerText}>{formatTimeForDisplay()}</Text>
          <Text style={styles.minuteText}>{t('time_attack.minute_label')}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bottomContainer}>
        {/* 5. 기존 TimePicker는 삭제하고 시작하기 버튼만 남깁니다. */}
        <Button
          title={t('time_attack.start')}
          onPress={handleStartAttack}
          style={styles.startButton}
          textStyle={styles.startButtonText}
        />
      </View>

      {/* 6. 시간 설정을 위한 Modal을 추가합니다. */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCancelTime}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={handleCancelTime}
          />
          <View style={styles.modalContent}>
            <TimePicker time={tempTime} setTime={setTempTime} />
            <View style={styles.modalButtonContainer}>
              <Button title={t('common.cancel')} onPress={handleCancelTime} style={styles.modalButton} primary={false} />
              <Button title={t('common.save')} onPress={handleConfirmTime} style={styles.modalButton} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  // 기존 스타일 유지
  screenContainer: { flex: 1, backgroundColor: Colors.primaryBeige },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  questionText: { fontSize: FontSizes.large, color: Colors.textDark, fontWeight: 'bold', marginBottom: 20 },
  timerDisplayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: Colors.lightGray,
    borderRadius: 15,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)'
  },
  timerText: { fontSize: 48, fontWeight: 'bold', color: Colors.textDark },
  minuteText: { fontSize: 32, fontWeight: 'bold', color: Colors.textDark, marginLeft: 10, marginTop: 5 },
  bottomContainer: {
    paddingBottom: 83,
    backgroundColor: Colors.primaryBeige
  },
  startButton: {
    backgroundColor: '#FFD700', // 노란색
    borderRadius: 5,
    paddingVertical: 15,
    marginHorizontal: 0,
    marginTop: 0,
  },
  startButtonText: { color: Colors.textDark, fontSize: FontSizes.large, fontWeight: 'bold' },

  // --- ⬇️ [추가] 모달을 위한 스타일 ---
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: Colors.primaryBeige,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 10,
  },
  modalButton: {
    flex: 1,
  }
});

export default TimeAttackGoalSettingScreen;
