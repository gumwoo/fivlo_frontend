// src/screens/ReminderTimeSettingModal.jsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Switch } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker'; // 시간 선택 UI
import { format, setHours, setMinutes } from 'date-fns';

// 공통 스타일 및 컴포넌트 임포트
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Button from '../../components/common/Button';
import { useTranslation } from 'react-i18next';

const ReminderTimeSettingModal = ({ initialTime, onTimeSelected, onClose }) => {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 초기 요일 상태 설정
  const initialDays = { '일': false, '월': false, '화': false, '수': false, '목': false, '금': false, '토': false };
  const [selectedDays, setSelectedDays] = useState(initialDays);

  // 초기 시간 설정
  useEffect(() => {
    if (initialTime) {
      const [hours, minutes] = initialTime.split(':').map(Number);
      setSelectedDate(setMinutes(setHours(new Date(), hours), minutes));
    }
  }, [initialTime]);

  const onChangeTime = (event, newDate) => {
    if (newDate) {
      setSelectedDate(newDate);
    }
  };

  const toggleDay = (day) => {
    setSelectedDays(prev => ({ ...prev, [day]: !prev[day] }));
  };

  const handleSave = () => {
    const timeString = format(selectedDate, 'HH:mm');
    const selectedRepeatDays = Object.keys(selectedDays).filter(day => selectedDays[day]);

    if (onTimeSelected) {
      onTimeSelected(timeString, selectedRepeatDays); // 시간과 요일 전달
    }
    onClose();
  };
  
  // t 함수를 사용하여 요일 배열을 가져옵니다.
  // 'reminder.days_full' 키에 ['월요일', '화요일', ...] 값이 있다고 가정합니다.
  // 만약 없다면 ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'] 로 직접 사용하셔도 됩니다.
  const daysOfWeek = t('reminder.days_full', { returnObjects: true });
  const dayShort = t('reminder.days_short', { returnObjects: true });


  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{t('reminder.time_setting')}</Text>

          {/* 시간 선택 */}
          <View style={styles.timePickerWrapper}>
            <DateTimePicker
              value={selectedDate}
              mode="time"
              display="spinner" // 스크롤 형식
              onChange={onChangeTime}
              style={styles.timePicker}
              locale="ko-KR" // 한국어 설정
            />
          </View>
          

          {/* 요일 반복 설정 */}
          <View style={styles.daysContainer}>
            {daysOfWeek.map((day, index) => (
              <View key={day} style={styles.dayRow}>
                <Text style={styles.dayText}>{day}</Text>
                <Switch
                  trackColor={{ false: Colors.secondaryBrown, true: Colors.accentApricot }}
                  thumbColor={Colors.textLight}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => toggleDay(dayShort[index])}
                  value={selectedDays[dayShort[index]]}
                />
              </View>
            ))}
          </View>

          <View style={styles.buttonContainer}>
            <Button title={t('reminder.cancel')} onPress={onClose} primary={false} style={styles.actionButton} />
            <Button title={t('reminder.save')} onPress={handleSave} style={styles.actionButton} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    backgroundColor: Colors.primaryBeige,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 25,
    width: '100%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: FontSizes.xlarge,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 20,
    textAlign: 'center',
  },
  timePickerWrapper: {
    width: '100%',
    backgroundColor: Colors.textLight,
    borderRadius: 15,
    paddingVertical: 10,
    marginBottom: 20,
  },
  timePicker: {
    width: '100%',
    height: 180,
  },
  daysContainer: {
    width: '100%',
    backgroundColor: Colors.textLight,
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 30,
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primaryBeige,
  },
  dayText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    fontWeight: FontWeights.medium,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default ReminderTimeSettingModal;