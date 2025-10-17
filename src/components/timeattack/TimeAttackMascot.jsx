// src/components/timeattack/TimeAttackMascot.jsx
import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet } from 'react-native';

// Shows the time-attack Obuni image with a gentle pulse when running.
const TimeAttackMascot = ({ running = true, size = 220 }) => {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let loop;
    if (running) {
      loop = Animated.loop(
        Animated.sequence([
          Animated.timing(scale, { toValue: 1.06, duration: 650, useNativeDriver: true }),
          Animated.timing(scale, { toValue: 1.0, duration: 650, useNativeDriver: true }),
        ])
      );
      loop.start();
    } else {
      scale.stopAnimation();
      scale.setValue(1);
    }
    return () => loop && loop.stop();
  }, [running, scale]);

  return (
    <Animated.View style={{ transform: [{ scale }], width: size, height: size }}>
      <Image
        source={require('../../../assets/타임어택.png')}
        style={[styles.image, { width: size, height: size }]}
        resizeMode="contain"
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  image: { alignSelf: 'center' },
});

export default TimeAttackMascot;

