// src/screens/TimeAttack/TimeAttackScreen.jsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';

import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Header from '../../components/common/Header';
import { useTranslation } from 'react-i18next';

import { getTimeAttackGoals, addTimeAttackGoal } from '../../utils/api'; // API 함수 임포트

const TimeAttackScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();

  const [goals, setGoals] = useState([]);
  const [editingGoalId, setEditingGoalId] = useState(null);

  // 목표 목록 조회
  const fetchGoals = async () => {
    try {
      const data = await getTimeAttackGoals();
      if (data && data.goals) {
        setGoals(data.goals);
      }
    } catch (error) {
      console.error('Failed to fetch time attack goals:', error);
      Alert.alert(t('common.error'), t('time_attack.fetch_error', '목표를 불러오는데 실패했습니다.'));
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleSelectGoal = (goal) => {
    // isPredefined가 true이면 번역된 텍스트를, 아니면 원래 텍스트를 사용
    const goalText = goal.isPredefined ? t(goal.name) : goal.name;
    navigation.navigate('TimeAttackGoalSettingScreen', { selectedGoal: goalText });
  };

  const handleAddGoal = () => {
    const newId = `new-${Date.now()}`;
    setGoals([...goals, { id: newId, name: '', isPredefined: false }]);
    setEditingGoalId(newId);
  };

  const handleUpdateGoalText = (id, text) => {
    setGoals(goals.map(goal => (goal.id === id ? { ...goal, name: text } : goal)));
  };

  const handleFinishEditing = async (item) => {
    setEditingGoalId(null);

    // 빈 텍스트면 삭제 (또는 취소)
    if (!item.name.trim()) {
      setGoals(goals.filter(g => g.id !== item.id));
      return;
    }

    // 새로운 목표인 경우 (ID가 'new-'로 시작) API 호출
    if (item.id.toString().startsWith('new-')) {
      try {
        await addTimeAttackGoal(item.name, i18n.language);
        // 저장 후 목록 다시 불러오기 (ID 동기화 등을 위해)
        await fetchGoals();
      } catch (error) {
        console.error('Failed to add time attack goal:', error);
        const errorMessage = error.response?.data?.message || '목표 추가에 실패했습니다.';
        Alert.alert(t('common.error'), errorMessage);
        // 실패 시 로컬 목록에서 제거하거나 재시도 옵션 제공
        setGoals(goals.filter(g => g.id !== item.id));
      }
    }
  };

  const handleDeleteGoal = (id) => {
    // API 연동 전 임시 로직 (나중에 API 연동 필요)
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const renderGoalItem = ({ item }) => {
    const isEditing = editingGoalId === item.id;
    const displayText = item.isPredefined ? t(item.name) : item.name;

    if (isEditing) {
      return (
        <View style={styles.goalItemEditing}>
          <TextInput
            style={styles.itemInput}
            value={item.name}
            onChangeText={(text) => handleUpdateGoalText(item.id, text)}
            autoFocus
            onBlur={() => handleFinishEditing(item)}
            onSubmitEditing={() => handleFinishEditing(item)}
            returnKeyType="done"
          />
        </View>
      );
    }

    return (
      <TouchableOpacity style={styles.goalItem} onPress={() => handleSelectGoal(item)}>
        <Text style={styles.itemText}>{displayText}</Text>
        <View style={styles.itemActions}>
          {!item.isPredefined && (
            <>
              <TouchableOpacity onPress={() => setEditingGoalId(item.id)} style={styles.iconButton}>
                <FontAwesome5 name="pen" size={16} color={Colors.secondaryBrown} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteGoal(item.id)} style={styles.iconButton}>
                <FontAwesome5 name="times" size={18} color={Colors.secondaryBrown} />
              </TouchableOpacity>
            </>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top }]}>
      <Header
        title={t('headers.time_attack')}
        showBackButton={true}
        onBackPress={() => navigation.navigate('Main', { screen: 'HomeTab' })}
        showRightButton
        onRightPress={() => {
          const firstGoal = goals[0];
          if (firstGoal) {
            handleSelectGoal(firstGoal);
          } else {
            // 목표가 없을 경우 기본값 처리 (필요 시)
            navigation.navigate('TimeAttackGoalSettingScreen', { selectedGoal: t('time_attack.default_goal') });
          }
        }}
      />
      <Text style={styles.title}>{t('time_attack.question_goal')}</Text>
      <FlatList
        data={goals}
        renderItem={renderGoalItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListFooterComponent={
          <TouchableOpacity style={styles.addGoalButton} onPress={handleAddGoal}>
            <Text style={styles.addGoalText}>{t('time_attack.add_other_goal')}</Text>
          </TouchableOpacity>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: Colors.primaryBeige },
  title: { fontSize: FontSizes.large, fontWeight: FontWeights.bold, color: Colors.textDark, marginHorizontal: 60, marginTop: 30, marginBottom: 30 },
  listContainer: { paddingHorizontal: 30 },
  goalItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.lightGray, borderRadius: 10, padding: 20, marginBottom: 30, justifyContent: 'space-between' },
  goalItemEditing: { backgroundColor: Colors.lightGray, borderRadius: 10, padding: 5, marginBottom: 15 },
  itemText: { fontSize: FontSizes.medium, fontWeight: FontWeights.bold, color: Colors.textDark, textAlign: 'center', justifyContent: 'center' },
  itemInput: { fontSize: FontSizes.medium, color: Colors.textDark, padding: 15 },
  itemActions: { flexDirection: 'row' },
  iconButton: { padding: 5, marginLeft: 15 },
  addGoalButton: { backgroundColor: Colors.lightGray, borderRadius: 10, padding: 15, alignItems: 'center', marginTop: 200, marginBottom: 30 },
  addGoalText: { fontSize: FontSizes.large, fontWeight: FontWeights.bold, color: Colors.secondaryBrown, },
});

export default TimeAttackScreen;
