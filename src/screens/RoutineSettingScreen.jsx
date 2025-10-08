// src/screens/RoutineSettingScreen.jsx
import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, Modal, Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

import Header from '../components/common/Header';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import WeeklyTaskCard from '../components/common/WeeklyTaskCard';
import { Colors } from '../styles/color';
import { FontSizes, FontWeights } from '../styles/Fonts';

/** 공용 체크박스 **/
const Check = ({ checked }) => (
  <View style={[styles.checkBox, checked && styles.checkBoxChecked]}>
    {checked ? <View style={styles.checkDot} /> : null}
  </View>
);
const CheckRow = ({ label, checked, onPress }) => (
  <TouchableOpacity style={styles.checkRow} onPress={onPress} activeOpacity={0.8}>
    <Check checked={checked} />
    <Text style={styles.checkLabel}>{label}</Text>
  </TouchableOpacity>
);

const RoutineSettingScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const [goal, setGoal] = useState('');
  const [usePeriod, setUsePeriod] = useState(false);       // 달성 기간 설정
  const [isContinuous, setIsContinuous] = useState(false); // 종료 기한 없이 지속
  const [targetDate, setTargetDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const [loadingAI, setLoadingAI] = useState(false);
  const [aiRecommended, setAiRecommended] = useState([]);

  const ymd = useMemo(() => ({
    y: format(targetDate, 'yyyy'),
    m: format(targetDate, 'MM'),
    d: format(targetDate, 'dd'),
  }), [targetDate]);

  const onPick = (_, d) => { if (d) setTargetDate(d); };

  const handleGenerate = () => {
    if (!goal.trim()) {
      Alert.alert(t('core.routine.required_title'), t('core.routine.required_goal'));
      return;
    }
    setLoadingAI(true);
    setTimeout(() => {
      setAiRecommended([
        { id: 'ai1', text: '매일 아침 10분 스트레칭', type: 'daily', week: 1, editable: true },
        { id: 'ai2', text: '주 3회 헬스장 방문', type: 'weekly', week: 1, editable: true },
        { id: 'ai3', text: '매일 저녁 샐러드 먹기', type: 'daily', week: 1, editable: true },
        { id: 'ai4', text: '매주 주말 등산하기', type: 'weekly', week: 2, editable: true },
        { id: 'ai5', text: '매일 자기 전 명상 5분', type: 'daily', week: 2, editable: true },
        { id: 'ai6', text: '매월 첫째 주 목표 점검', type: 'monthly', week: 2, editable: true },
      ]);
      setLoadingAI(false);
    }, 1200);
  };

  const toggleUsePeriod = () => { setUsePeriod(v => !v); setIsContinuous(false); };
  const toggleContinuous = () => { setIsContinuous(v => !v); setUsePeriod(false); };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}> 
      <Header title={t('core.routine.header', '목표 세분화')} showBackButton />

      <ScrollView contentContainerStyle={styles.content}>
        {/* 목표 입력 */}
        <Text style={styles.sectionTitle}>{t('core.routine.goal_input_label', '목표 입력')}</Text>
        <Input
          placeholder={t('core.routine.goal_input_placeholder',
            '달성하고자 하는 목표를 작성해주세요.\nEx. TOEIC 800점 이상, 매일 운동하기 등')}
          value={goal}
          onChangeText={setGoal}
          multiline
          numberOfLines={3}
          style={[styles.inputBox, styles.shadowLite]}
        />

        {/* 목표 달성기간 */}
        <Text style={styles.sectionTitleBottomGap}>{t('core.routine.target_period_label', '목표 달성기간')}</Text>

        <CheckRow
          label={t('core.routine.set_period', '달성 기간 설정')}
          checked={usePeriod}
          onPress={toggleUsePeriod}
        />

        {usePeriod && (
          <TouchableOpacity onPress={() => setShowPicker(true)} activeOpacity={0.85} style={styles.ymdRow}>
            <View style={styles.chip}>
              <Text style={styles.chipTitle}>{t('core.routine.year_short', '년')}</Text>
              <Text style={styles.chipValue}>{ymd.y}</Text>
            </View>
            <View style={styles.chip}>
              <Text style={styles.chipTitle}>{t('core.routine.month_short', '월')}</Text>
              <Text style={styles.chipValue}>{ymd.m}</Text>
            </View>
            <View style={styles.chip}>
              <Text style={styles.chipTitle}>{t('core.routine.day_short', '일')}</Text>
              <Text style={styles.chipValue}>{ymd.d}</Text>
            </View>
          </TouchableOpacity>
        )}

        <CheckRow
          label={t('core.routine.continuous', '종료 기한 없이 지속')}
          checked={isContinuous}
          onPress={toggleContinuous}
        />

        <Button
          title={t('core.routine.generate', 'AI 맞춤일정 생성하기')}
          onPress={handleGenerate}
          style={styles.generateButton}
        />

        {loadingAI && (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={Colors.secondaryBrown} />
            <Text style={styles.loadingText}>
              {t('core.routine.loading', '오분이가 목표 달성을 위한 일정을 생성하고 있어요!')}
            </Text>
          </View>
        )}

        {!loadingAI && aiRecommended.length > 0 && (
          <View style={[styles.aiCard, styles.shadowLite]}>
            <WeeklyTaskCard
              allTasks={aiRecommended}
              isContinuous={isContinuous}
              onEditTask={() => {}}
              onAddToTask={() => {}}
            />
          </View>
        )}
      </ScrollView>

      {/* 하단 날짜 피커 시트 */}
      <Modal visible={showPicker} transparent animationType="slide" onRequestClose={() => setShowPicker(false)}>
        <View style={styles.pickerOverlay}>
          <View style={[styles.pickerSheet, styles.shadowHard]}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>{t('core.routine.date_title', '날짜 설정')}</Text>
              <TouchableOpacity onPress={() => setShowPicker(false)}>
                <Text style={styles.pickerSave}>{t('task.save', '저장')}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.pickerLabels}>
              <Text style={styles.pickerLabel}>{t('core.routine.year_short', '년')}</Text>
              <Text style={styles.pickerLabel}>{t('core.routine.month_short', '월')}</Text>
              <Text style={styles.pickerLabel}>{t('core.routine.day_short', '일')}</Text>
            </View>

            <DateTimePicker
              value={targetDate}
              mode="date"
              display="spinner"
              onChange={onPick}
              minimumDate={new Date()}
              style={{ alignSelf: 'stretch' }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.primaryBeige },
  content: { 
    paddingHorizontal: 20, 
    paddingBottom: 100, // 하단 탭바 여백 확보
    paddingTop: 20, // ✨ 수정: 상단 여백을 확보하여 제목이 붙지 않도록 조정
  },
  sectionTitle: { // '목표 입력' 제목에 사용
    fontSize: FontSizes.large, 
    fontWeight: FontWeights.bold,
    color: Colors.textDark, 
    marginTop: 0, 
    marginBottom: 10, // Input과의 간격
  },
  sectionTitleBottomGap: { // '목표 달성기간' 제목에 사용
    fontSize: FontSizes.large, 
    fontWeight: FontWeights.bold,
    color: Colors.textDark, 
    marginTop: 35, // ✨ 수정: 위 섹션 (Input Box)과 충분한 간격 확보
    marginBottom: 10, // 아래 체크박스와의 간격 
  },
  inputBox: { 
    minHeight: 100, 
    textAlignVertical: 'top',
    paddingHorizontal: 15,
    paddingVertical: 15,
    alignSelf: 'stretch',
    width: '100%', 
  },

  /* 체크박스 라인 */
  checkRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 10, // ✨ 수정: 체크박스 항목 간 세로 간격 10pt
    marginBottom: 5,
  },
  checkBox: {
    width: 24, 
    height: 24, 
    borderRadius: 6,
    borderWidth: 2, 
    borderColor: Colors.secondaryBrown,
    alignItems: 'center', 
    justifyContent: 'center',
    marginRight: 15,
    backgroundColor: 'transparent',
  },
  checkBoxChecked: { borderColor: Colors.accentApricot, backgroundColor: 'rgba(255, 186, 130, 0.35)' },
  checkDot: { width: 12, height: 12, borderRadius: 3, backgroundColor: Colors.accentApricot },
  checkLabel: { fontSize: FontSizes.medium, color: Colors.textDark },

  /* 년/월/일 칩 */
  ymdRow: { 
    flexDirection: 'row', 
    gap: 10, 
    marginTop: 15, 
    marginBottom: 15
  },
  chip: {
    flex: 1, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 12,
    backgroundColor: 'rgba(0,0,0,0.06)', borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)',
  },
  chipTitle: { fontSize: FontSizes.small, color: Colors.secondaryBrown, marginBottom: 4 },
  chipValue: { fontSize: FontSizes.medium + 2, fontWeight: '700', color: Colors.textDark, textAlign: 'right' },
  
  generateButton: { 
    marginTop: 40, // ✨ 수정: 버튼 상단 여백을 충분히 확보
  },

  /* 로딩 */
  loading: { alignItems: 'center', marginTop: 28 },
  loadingText: { marginTop: 12, color: Colors.secondaryBrown, textAlign: 'center' },

  /* AI 카드(회색 반투명) */
  aiCard: { marginTop: 18, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 16, padding: 14 },

  /* 하단 피커 시트 */
  pickerOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' },
  pickerSheet: {
    backgroundColor: Colors.textLight, borderTopLeftRadius: 16, borderTopRightRadius: 16,
    paddingHorizontal: 16, paddingTop: 10, paddingBottom: 6,
  },
  pickerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  pickerTitle: { fontSize: FontSizes.large, fontWeight: '700', color: Colors.textDark },
  pickerSave: { fontSize: FontSizes.medium, fontWeight: '700', color: Colors.accentApricot },
  pickerLabels: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 6 },
  pickerLabel: { width: 80, textAlign: 'center', fontWeight: '700', color: Colors.secondaryBrown },

  /* 그림자 */
  shadowLite: {
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2, elevation: 2,
  },
  shadowHard: {
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 6,
  },
});

export default RoutineSettingScreen;