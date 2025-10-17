// src/components/common/TimePicker.jsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import WheelPicker from './WheelPicker';
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
        <WheelPicker
          items={hours}
          selectedValue={time.h}
          onValueChange={(value) => setTime(prev => ({ ...prev, h: value }))}
        />
        <WheelPicker
          items={minutes}
          selectedValue={time.m}
          onValueChange={(value) => setTime(prev => ({ ...prev, m: value }))}
        />
        <WheelPicker
          items={seconds}
          selectedValue={time.s}
          onValueChange={(value) => setTime(prev => ({ ...prev, s: value }))}
        />
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
    marginBottom: 10,
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
    height: 200,
  },
});

export default TimePicker;