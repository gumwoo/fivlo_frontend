// src/components/common/DonutChart.jsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';

/**
 * 원형(도넛) 차트 컴포넌트
 * @param {number} percentage - 퍼센트 (0-100)
 * @param {number} size - 차트 크기 (기본: 100)
 * @param {number} strokeWidth - 선 두께 (기본: 10)
 * @param {string} color - 차트 색상 (기본: Colors.secondaryBrown)
 */
const DonutChart = ({ 
  percentage = 0, 
  size = 100, 
  strokeWidth = 10,
  color = Colors.secondaryBrown 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * percentage) / 100;
  const center = size / 2;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {/* 배경 원 */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={Colors.primaryBeige}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* 진행률 원 */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${center}, ${center}`}
        />
      </Svg>
      {/* 중앙 퍼센트 텍스트 */}
      <View style={styles.textContainer}>
        <Text style={styles.percentageText}>{Math.round(percentage)}%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
  },
});

export default DonutChart;
