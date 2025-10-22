// src/screens/Reminder/ReminderChecklistOverlayModal.jsx

import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import { FontAwesome5 } from '@expo/vector-icons';
import Button from '../../components/common/Button';
import CharacterImage from '../../components/common/CharacterImage';
import { useTranslation } from 'react-i18next';
import ReminderCompleteCoinModal from './ReminderCompleteCoinModal';

const ReminderChecklistOverlayModal = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const title = route.params?.reminderTitle || t('reminder.check_please');
  const initialItems = route.params?.items || t('reminder.default_checklist', { returnObjects: true });
  const [items, setItems] = useState(initialItems.map((x) => ({ text: x, done: false })));

  const allDone = useMemo(() => items.length > 0 && items.every((i) => i.done), [items]);

  const toggle = (idx) => {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, done: !it.done } : it)));
  };

  const onClose = () => navigation.goBack();

  const [showCoin, setShowCoin] = useState(false);
  const onConfirm = () => {
    if (allDone) {
      setShowCoin(true);
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={[styles.overlay, { paddingTop: insets.top }]}>      
      <View style={styles.card}>
        <CharacterImage style={styles.mascot} />
        <Text style={styles.title}>{t('reminder.dont_forget')}</Text>

        <View style={styles.sheet}>
          <Text style={styles.sheetTitle}>{t('reminder.check_please')}</Text>
          {items.map((it, idx) => (
            <TouchableOpacity key={idx} style={styles.row} onPress={() => toggle(idx)}>
              <FontAwesome5
                name={it.done ? 'check-square' : 'square'}
                size={22}
                color={it.done ? Colors.accentApricot : Colors.secondaryBrown}
              />
              <Text style={[styles.rowText, it.done && styles.rowDone]}>{it.text}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Button title={t('reminder.confirm')} onPress={onConfirm} style={styles.button} />
      </View>
      <ReminderCompleteCoinModal isVisible={showCoin} onClose={() => { setShowCoin(false); navigation.goBack(); }} />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '86%',
    backgroundColor: Colors.primaryBeige,
    borderRadius: 20,
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 24,
  },
  mascot: {
    width: 140,
    height: 140,
    marginBottom: 8,
  },
  title: {
    fontSize: FontSizes.xlarge,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 12,
  },
  sheet: {
    width: '86%',
    backgroundColor: Colors.textLight,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  rowText: {
    marginLeft: 10,
    fontSize: FontSizes.medium,
    color: Colors.textDark,
  },
  rowDone: {
    textDecorationLine: 'line-through',
    color: Colors.secondaryBrown,
  },
  button: {
    width: '86%',
  },
});

export default ReminderChecklistOverlayModal;
