// src/screens/RoutineSettingScreen.jsx

import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, Modal, TextInput
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

/** ───────────── 공통 체크박스 ───────────── **/
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
  const { t, i18n } = useTranslation();

  // 입력
  const [goal, setGoal] = useState('');
  // 기간
  const [usePeriod, setUsePeriod] = useState(false);        // “달성 기간 설정”
  const [isContinuous, setIsContinuous] = useState(false);  // “종료 기한 없이 지속” (둘은 상호배타)
  const [targetDate, setTargetDate] = useState(new Date());

  // 날짜 피커
  const [showPicker, setShowPicker] = useState(false);

  // AI 결과
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiRecommended, setAiRecommended] = useState([]);

  const ymd = useMemo(() => ({
    y: format(targetDate, 'yyyy'),
    m: format(targetDate, 'MM'),
    d: format(targetDate, 'dd'),
  }), [targetDate]);

  const openPicker = () => setShowPicker(true);
  const onPick = (_, d) => {
    // d가 없을 때는 취소(iOS)
    if (d) setTargetDate(d);
  };

  const handleGenerate = () => {
    if (!goal.trim()) {
      // 필수 안내
      alert(t('core.routine.required_goal', '목표를 입력해 주세요.'));
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

  // 상호배타 토글
  const toggleUsePeriod = () => {
    setUsePeriod(v => !v);
    setIsContinuous(false);
  };
  const toggleContinuous = () => {
    setIsContinuous(v => !v);
    setUsePeriod(false);
  };

  // 주차별 그룹
  const groupByWeek = (arr) => arr.reduce((m, t) => {
    const w = t.week || 1;
    (m[w] ||= []).push(t);
    return m;
  }, {});

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 12 }]}>
      <Header title={t('core.routine.header', '목표 세분화')} showBackButton />

      <ScrollView contentContainerStyle={styles.content}>
        {/* 목표 입력 */}
        <Text style={styles.sectionTitle}>{t('core.routine.goal_input_label', '목표 입력')}</Text>
        <Input
          placeholder={t('core.routine.goal_input_placeholder', '달성하고자 하는 목표를 작성해주세요.\nEx. TOEIC 800점 이상, 매일 운동하기 등')}
          value={goal}
          onChangeText={setGoal}
          multiline
          numberOfLines={3}
          style={[styles.inputBox, styles.shadowLite]}
        />
        {/* 예시 배지(회색 반투명) */}
        <View style={styles.hintBadge}>
          <Text style={styles.hintText}>
            {t('core.routine.goal_hint', '달성하고자 하는 목표를 작성해주세요.\nEx. TOEIC 800점 이상, 매일 운동하기 등')}
          </Text>
        </View>

        {/* 목표 달성기간 */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
          {t('core.routine.target_period_label', '목표 달성기간')}
        </Text>

        <CheckRow
          label={t('core.routine.set_period', '달성 기간 설정')}
          checked={usePeriod}
          onPress={toggleUsePeriod}
        />

        {/* 회색 반투명 칩(년/월/일) – 기간 사용 시 노출 */}
        {usePeriod && (
          <TouchableOpacity onPress={openPicker} activeOpacity={0.85} style={styles.ymdRow}>
            <View style={styles.chip}><Text style={styles.chipTitle}>{t('core.routine.year_short', '년')}</Text><Text style={styles.chipValue}>{ymd.y}</Text></View>
            <View style={styles.chip}><Text style={styles.chipTitle}>{t('core.routine.month_short', '월')}</Text><Text style={styles.chipValue}>{ymd.m}</Text></View>
            <View style={styles.chip}><Text style={styles.chipTitle}>{t('core.routine.day_short', '일')}</Text><Text style={styles.chipValue}>{ymd.d}</Text></View>
          </TouchableOpacity>
        )}

        <CheckRow
          label={t('core.routine.continuous', '종료 기한 없이 지속')}
          checked={isContinuous}
          onPress={toggleContinuous}
        />

        <Button
          title={t('core.routine.generate', '맞춤일정 생성하기')}
          onPress={handleGenerate}
          style={{ marginTop: 14 }}
        />

        {/* 로딩 상태 */}
        {loadingAI && (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={Colors.secondaryBrown} />
            <Text style={styles.loadingText}>
              {t('core.routine.loading', '오분이가 목표 달성을 위한 일정을 생성하고 있어요!')}
            </Text>
          </View>
        )}

        {/* AI 추천 카드(회색 박스) */}
        {!loadingAI && aiRecommended.length > 0 && (
          <View style={[styles.aiCard, styles.shadowLite]}>
            {Object.entries(groupByWeek(aiRecommended)).map(([week, list]) => (
              <WeeklyTaskCard
                key={week}
                weekNumber={parseInt(week, 10)}
                tasks={list}
                onEditTask={() => {}}
                onAddToTask={() => {}}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* 날짜 하단 스피너(플랫폼 공통) */}
      <Modal visible={showPicker} transparent animationType="slide" onRequestClose={() => setShowPicker(false)}>
        <View style={styles.pickerOverlay}>
          <View style={[styles.pickerSheet, styles.shadowHard]}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>{t('core.routine.date_title', '날짜 설정')}</Text>
              <TouchableOpacity onPress={() => setShowPicker(false)}>
                <Text style={styles.pickerSave}>{t('task.save', '저장')}</Text>
              </TouchableOpacity>
            </View>

            {/* 라벨 행 */}
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
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  sectionTitle: {
    fontSize: FontSizes.large, fontWeight: FontWeights.bold,
    color: Colors.textDark, marginBottom: 10,
  },

  /* 입력 */
  inputBox: { minHeight: 100, textAlignVertical: 'top' },
  hintBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 10, paddingHorizontal: 14,
    backgroundColor: 'rgba(0,0,0,0.06)',
    borderRadius: 10, marginTop: 10,
  },
  hintText: { color: Colors.secondaryBrown, fontSize: FontSizes.medium, lineHeight: 20 },

  /* 체크박스 라인 */
  checkRow: { flexDirection: 'row', alignItems: 'center', marginTop: 14 },
  checkBox: {
    width: 22, height: 22, borderRadius: 4,
    borderWidth: 2, borderColor: Colors.secondaryBrown,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 10, backgroundColor: 'transparent',
  },
  checkBoxChecked: { borderColor: Colors.accentApricot, backgroundColor: 'rgba(255, 186, 130, 0.35)' },
  checkDot: { width: 10, height: 10, borderRadius: 2, backgroundColor: Colors.accentApricot },
  checkLabel: { fontSize: FontSizes.medium, color: Colors.textDark },

  /* 년/월/일 칩 */
  ymdRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  chip: {
    flex: 1, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 12,
    backgroundColor: 'rgba(0,0,0,0.06)', borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)',
  },
  chipTitle: { fontSize: 12, color: Colors.secondaryBrown, marginBottom: 4 },
  chipValue: { fontSize: 18, fontWeight: '700', color: Colors.textDark, textAlign: 'right' },

  /* 로딩 */
  loading: { alignItems: 'center', marginTop: 28 },
  loadingText: { marginTop: 12, color: Colors.secondaryBrown, textAlign: 'center' },

  /* AI 카드 */
  aiCard: { marginTop: 18, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 16, padding: 14 },

  /* 하단 피커 시트 */
  pickerOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' },
  pickerSheet: {
    backgroundColor: Colors.textLight, borderTopLeftRadius: 16, borderTopRightRadius: 16,
    paddingHorizontal: 16, paddingTop: 10, paddingBottom: 6,
  },
  pickerHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6,
  },
  pickerTitle: { fontSize: FontSizes.large, fontWeight: '700', color: Colors.textDark },
  pickerSave: { fontSize: FontSizes.medium, fontWeight: '700', color: Colors.accentApricot },
  pickerLabels: {
    flexDirection: 'row', justifyContent: 'space-around', marginBottom: 6,
  },
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
