// src/components/common/WheelPicker.jsx

import React, { useRef, useState, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../../styles/color';
import { FontSizes } from '../../styles/Fonts';

const ITEM_HEIGHT = 40;
const VISIBLE_ITEMS = 5;

const WheelPicker = ({ items, selectedValue, onValueChange }) => {
  const scrollViewRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  
  const selectedIndex = items.findIndex(item => item === selectedValue);

  useEffect(() => {
    // 초기 위치로 스크롤
    if (scrollViewRef.current && selectedIndex >= 0) {
      scrollViewRef.current.scrollTo({
        y: selectedIndex * ITEM_HEIGHT,
        animated: false,
      });
    }
  }, []);

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setScrollY(offsetY);
  };

  const handleMomentumScrollEnd = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(index, items.length - 1));
    
    // 스냅
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        y: clampedIndex * ITEM_HEIGHT,
        animated: true,
      });
    }
    
    if (onValueChange && items[clampedIndex] !== selectedValue) {
      onValueChange(items[clampedIndex]);
    }
  };

  const renderItem = (item, index) => {
    const centerPosition = scrollY + (ITEM_HEIGHT / 2);
    const itemPosition = index * ITEM_HEIGHT + ITEM_HEIGHT / 2;
    const distance = Math.abs(centerPosition - itemPosition);
    const isCenter = distance < ITEM_HEIGHT / 2;
    
    // 거리에 따라 opacity와 scale 조정
    const maxDistance = ITEM_HEIGHT * 2;
    const opacity = Math.max(0.5, 1 - (distance / maxDistance) * 0.7);
    const scale = Math.max(0.9, 1 - (distance / maxDistance) * 0.2);

    return (
      <View
        key={index}
        style={[
          styles.item,
          {
            opacity,
            transform: [{ scale }],
          },
        ]}
      >
        <Text
          style={[
            styles.itemText,
            isCenter && styles.itemTextSelected,
          ]}
        >
          {String(item).padStart(2, '0')}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* 상단 페이드 */}
      <View style={[styles.fade, styles.fadeTop]} pointerEvents="none" />
      
      {/* 중앙 선택 영역 표시 */}
      <View style={styles.selectionIndicator} pointerEvents="none" />
      
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        contentContainerStyle={{
          paddingVertical: ITEM_HEIGHT * 2,
        }}
      >
        {items.map((item, index) => renderItem(item, index))}
      </ScrollView>
      
      {/* 하단 페이드 */}
      <View style={[styles.fade, styles.fadeBottom]} pointerEvents="none" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
  },
  item: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    fontSize: FontSizes.large,
    color: Colors.textDark,
    fontWeight: '400',
  },
  itemTextSelected: {
    fontSize: FontSizes.extraLarge,
    fontWeight: '700',
  },
  selectionIndicator: {
    position: 'absolute',
    top: ITEM_HEIGHT * 2,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
  fade: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: ITEM_HEIGHT * 2,
    zIndex: 1,
  },
  fadeTop: {
    top: 0,
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
  },
  fadeBottom: {
    bottom: 0,
    backgroundColor: 'transparent',
  },
});

export default WheelPicker;
