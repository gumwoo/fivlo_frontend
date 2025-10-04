// src/components/common/TimePicker.jsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Colors } from '../../styles/color';
import { FontSizes } from '../../styles/Fonts';

const TimePicker = ({ time, setTime }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const seconds = Array.from({ length: 60 }, (_, i) => i);

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>시간</Text>
        <Text style={styles.label}>분</Text>
        <Text style={styles.label}>초</Text>
      </View>
      <View style={styles.pickerContainer}>
        {/* 시간 Picker */}
        <Picker
          selectedValue={time.h}
          style={styles.picker}
          itemStyle={styles.itemStyle}
          onValueChange={(itemValue) => setTime(prev => ({ ...prev, h: itemValue }))}
        >
          {hours.map(h => (
            <Picker.Item key={`hour-${h}`} label={String(h).padStart(2, '0')} value={h} />
          ))}
        </Picker>

        {/* 분 Picker */}
        <Picker
          selectedValue={time.m}
          style={styles.picker}
          itemStyle={styles.itemStyle}
          onValueChange={(itemValue) => setTime(prev => ({ ...prev, m: itemValue }))}
        >
          {minutes.map(m => (
            <Picker.Item key={`minute-${m}`} label={String(m).padStart(2, '0')} value={m} />
          ))}
        </Picker>

        {/* 초 Picker */}
        <Picker
          selectedValue={time.s}
          style={styles.picker}
          itemStyle={styles.itemStyle}
          onValueChange={(itemValue) => setTime(prev => ({ ...prev, s: itemValue }))}
        >
          {seconds.map(s => (
            <Picker.Item key={`second-${s}`} label={String(s).padStart(2, '0')} value={s} />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: Colors.primaryBeige,
    paddingVertical: 10,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: -20, // Picker 위에 겹치도록
  },
  label: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    fontWeight: '600',
    width: '33%',
    textAlign: 'center'
  },
  pickerContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 150,
  },
  picker: {
    flex: 1,
  },
  itemStyle: {
    fontSize: 26,
    color: Colors.textDark,
    fontWeight: '600',
    height: 150,
  },
});

export default TimePicker;