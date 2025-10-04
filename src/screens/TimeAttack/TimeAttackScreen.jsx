// src/screens/TimeAttack/TimeAttackScreen.jsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';

import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Header from '../../components/common/Header';
import { useTranslation } from 'react-i18next';

const TimeAttackScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const [goals, setGoals] = useState([
    { id: 'g1', text: '외출 준비' },
    { id: 'g2', text: '식사 준비' },
    { id: 'g3', text: '집 정리하기' },
  ]);
  const [editingGoalId, setEditingGoalId] = useState(null);

  const handleSelectGoal = (goalText) => {
    navigation.navigate('TimeAttackGoalSettingScreen', { selectedGoal: goalText });
  };

  const handleAddGoal = () => {
    const newId = `new-${Date.now()}`;
    setGoals([...goals, { id: newId, text: '' }]);
    setEditingGoalId(newId);
  };

  const handleUpdateGoalText = (id, text) => {
    setGoals(goals.map(goal => (goal.id === id ? { ...goal, text } : goal)));
  };

  const handleDeleteGoal = (id) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };
  
  const renderGoalItem = ({ item }) => {
    const isEditing = editingGoalId === item.id;

    if (isEditing) {
      return (
        <View style={styles.goalItemEditing}>
          <TextInput
            style={styles.itemInput}
            value={item.text}
            onChangeText={(text) => handleUpdateGoalText(item.id, text)}
            autoFocus
            onBlur={() => setEditingGoalId(null)}
          />
        </View>
      );
    }

    return (
      <TouchableOpacity style={styles.goalItem} onPress={() => handleSelectGoal(item.text)}>
        <Text style={styles.itemText}>{item.text}</Text>
        <View style={styles.itemActions}>
          <TouchableOpacity onPress={() => setEditingGoalId(item.id)} style={styles.iconButton}>
            <FontAwesome5 name="pen" size={16} color={Colors.secondaryBrown} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDeleteGoal(item.id)} style={styles.iconButton}>
            <FontAwesome5 name="times" size={18} color={Colors.secondaryBrown} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top }]}>
      <Header title={t('headers.time_attack')} showBackButton={true} />
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