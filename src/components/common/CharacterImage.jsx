// src/components/common/CharacterImage.jsx (예시)
import React from 'react';
import { Image, StyleSheet } from 'react-native';

// 실제 이미지 경로 정의
const obooniDefault = require('../../../assets/obooni_default_base.png');
const obooniHappy = require('../../../assets/images/obooni_happy.png');
const obooniSad = require('../../../assets/images/obooni_sad.png');

export const CharacterSources = {
  default: obooniDefault,
  happy: obooniHappy,
  sad: obooniSad,
};

const CharacterImage = ({ state = 'default', style }) => {
  let source;
  switch (state) {
    case 'happy':
      source = CharacterSources.happy;
      break;
    case 'sad':
      source = CharacterSources.sad;
      break;
    case 'default':
    default:
      source = CharacterSources.default;
      break;
  }

  return <Image source={source} style={[styles.image, style]} resizeMode="contain" />;
};

const styles = StyleSheet.create({
  image: {
    width: 150, // 기본 크기
    height: 150,
    marginVertical: 20,
  },
});

export default CharacterImage;