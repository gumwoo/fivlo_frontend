// src/components/common/WeeklyTaskCard.jsx
import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';

const WeeklyTaskCard = ({ allTasks = [], isContinuous = false, onEditTask, onAddToTask }) => {
  const [checked, setChecked] = useState({});

  const grouped = useMemo(() => {
    return allTasks.reduce((m, t) => {
      const w = t.week || 1;
      (m[w] ||= []).push(t);
      return m;
    }, {});
  }, [allTasks]);

  const toggle = (id) => setChecked(prev => ({ ...prev, [id]: !prev[id] }));

  const title = isContinuous ? '오분이가 추천하는 반복일정' : '오분이가 추천하는 일정';

  // 첫 항목 기준으로 편집/추가 트리거 (원하면 개별 버튼으로 확장 가능)
  const firstTask = allTasks[0];

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>

      {Object.entries(grouped).map(([week, list], idx) => (
        <View key={week} style={[styles.weekBlock, idx > 0 && styles.weekBlockDivider]}>
          <Text style={styles.weekLabel}>{week}주차</Text>

          {list.map((t) => {
            const id = t.id ?? `${week}-${t.text}`;
            const isOn = !!checked[id];
            return (
              <TouchableOpacity key={id} style={styles.row} onPress={() => toggle(id)} activeOpacity={0.8}>
                <View style={[styles.box, isOn && styles.boxOn]}>
                  {isOn ? <FontAwesome5 name="check" size={12} color="#fff" /> : null}
                </View>
                <Text style={styles.rowText}>{t.text}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}

      <View style={styles.footer}>
        <TouchableOpacity style={styles.editBtn} onPress={() => onEditTask?.(firstTask)}>
          <FontAwesome5 name="edit" size={16} color={Colors.textDark} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.addBtn} onPress={() => onAddToTask?.(firstTask)}>
          <Text style={styles.addBtnText}>TASK에 추가하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 16,
    padding: 10,
  },
  title: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 20,
  },
  weekBlock: { paddingTop: 10, paddingBottom: 10 },
  weekBlockDivider: {
    borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.1)', marginTop: 20,
  },
  weekLabel: {
    fontSize: FontSizes.medium,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 10,
  },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  box: {
    width: 20, height: 20, borderRadius: 4, borderWidth: 2,
    borderColor: Colors.textDark, backgroundColor: Colors.textLight,
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  boxOn: { backgroundColor: Colors.accentApricot, borderColor: Colors.accentApricot },
  rowText: { flex: 1, fontSize: FontSizes.medium, color: Colors.textDark },

  footer: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 6, gap: 10 },
  editBtn: {
    width: 40, height: 40, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)',
    backgroundColor: Colors.textLight, justifyContent: 'center', alignItems: 'center',
  },
  addBtn: {
    paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)', backgroundColor: Colors.textLight,
  },
  addBtnText: { fontSize: FontSizes.small, color: Colors.textDark, fontWeight: FontWeights.medium },
});

export default WeeklyTaskCard;
