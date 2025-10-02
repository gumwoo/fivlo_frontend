// src/screens/ReminderChecklistScreen.jsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import { useTranslation } from 'react-i18next';
import ReminderCompleteCoinModal from './ReminderCompleteCoinModal';

const ReminderChecklistScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const { reminderTitle, checklistItems: initialChecklistItems } = route.params || {
    reminderTitle: t('reminder.title'),
    checklistItems: t('reminder.default_checklist', { returnObjects: true })
  };

  const [checklist, setChecklist] = useState(
    initialChecklistItems.map(item => ({ text: item, completed: false }))
  );
  const [showCoinModal, setShowCoinModal] = useState(false);

  useEffect(() => {
    const allCompleted = checklist.every(item => item.completed);
    if (allCompleted && checklist.length > 0) {
      // --- ✨ [수정] 코인 지급 로직 조건 강화 ---
      // TODO: 실제 구현 시 아래 로직을 활성화해야 합니다.
      // 1. 현재 사용자가 유료 사용자인지 확인
      // const isPremiumUser = checkUserPremiumStatus();
      // 2. 오늘 하루의 모든 알림 항목이 완료되었는지 확인
      // const allRemindersDone = checkAllDayRemindersDone();
      // if (isPremiumUser && allRemindersDone) {
      //   setShowCoinModal(true);
      // }
      
      // 현재는 테스트를 위해 바로 모달을 띄웁니다.
      setShowCoinModal(true);
    }
  }, [checklist]);

  const toggleChecklistItem = (index) => {
    const newChecklist = [...checklist];
    newChecklist[index].completed = !newChecklist[index].completed;
    setChecklist(newChecklist);
  };
  
  // --- ✨ [수정] 버튼 클릭 시 Alert 대신 콘솔 로그로 변경 ---
  const handleSnooze = () => {
    console.log(t('reminder.snooze_implementation'));
    navigation.goBack();
  };

  const handleSkip = () => {
    console.log(t('reminder.skip_implementation'));
    navigation.goBack();
  };

  const renderChecklistItem = ({ item, index }) => (
    <TouchableOpacity style={styles.checklistItem} onPress={() => toggleChecklistItem(index)}>
      <View style={styles.checkbox}>
        <FontAwesome5 name={item.completed ? 'check-square' : 'square'} size={24} color={item.completed ? Colors.accentApricot : Colors.secondaryBrown} />
      </View>
      <Text style={[styles.itemText, item.completed && styles.itemTextCompleted]}>{item.text}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top + 20 }]}>
      <Header title={reminderTitle} showBackButton={true} />
      <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
        <Text style={styles.instructionText}>{t('reminder.checklist_question')}</Text>
        <FlatList
          data={checklist}
          renderItem={renderChecklistItem}
          keyExtractor={(item, index) => index.toString()}
          scrollEnabled={false}
        />
        <View style={styles.actionButtonContainer}>
          <Button title={t('reminder.remind_in_5m')} onPress={handleSnooze} primary={false} style={styles.actionButton} />
          <Button title={t('reminder.skip_today')} onPress={handleSkip} primary={false} style={styles.actionButton} />
        </View>
      </ScrollView>

      {/* --- ✨ [수정] 중복 Modal 제거, 컴포넌트 직접 호출 --- */}
      <ReminderCompleteCoinModal
        isVisible={showCoinModal}
        onClose={() => setShowCoinModal(false)}
      />
    </View>
  );
};

// (스타일 코드는 유지)
const styles = StyleSheet.create({
    screenContainer: { flex: 1, backgroundColor: Colors.primaryBeige, },
    scrollViewContentContainer: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 10, alignItems: 'center', },
    instructionText: { fontSize: FontSizes.large, fontWeight: FontWeights.bold, color: Colors.textDark, marginBottom: 30, textAlign: 'center', },
    checklistItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.textLight, borderRadius: 10, paddingVertical: 15, paddingHorizontal: 15, marginBottom: 10, },
    checkbox: { marginRight: 15, },
    itemText: { fontSize: FontSizes.medium, color: Colors.textDark, flex: 1, },
    itemTextCompleted: { textDecorationLine: 'line-through', color: Colors.secondaryBrown, },
    actionButtonContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 30, },
    actionButton: { flex: 1, marginHorizontal: 5, },
});

export default ReminderChecklistScreen;