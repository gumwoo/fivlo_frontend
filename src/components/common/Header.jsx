// src/components/common/Header.jsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../styles/color';
import { FontWeights, FontSizes } from '../../styles/Fonts';

const Header = ({ title, showBackButton = true, onBackPress, showRightButton = false, onRightPress, rightIcon = 'arrow-forward' }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.headerContainer}>
      {showBackButton && (
        <TouchableOpacity onPress={() => (onBackPress ? onBackPress() : navigation.goBack())} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.textDark} />
        </TouchableOpacity>
      )}
      <Text style={styles.headerTitle}>{title}</Text>
      {showRightButton ? (
        <TouchableOpacity onPress={onRightPress} style={styles.backButton}>
          <Ionicons name={rightIcon} size={24} color={Colors.textDark} />
        </TouchableOpacity>
      ) : (
        showBackButton ? <View style={{ width: 24 }} /> : <View style={{ width: 0 }} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    // --- 수정: 좌우 여백을 15에서 30으로 늘림 ---
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.textLight,
    borderBottomWidth: 0,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
  },
});

export default Header;
