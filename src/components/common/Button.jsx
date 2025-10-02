// src/components/common/Button.jsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';

// variant: "brand" | "default" | "text"
// brandType: "google" | "apple" | "kakao"
const Button = ({ title, onPress, style, textStyle, variant = "default", brandType }) => {
  let buttonStyle = styles.defaultButton;
  let textColor = Colors.textLight;

  if (variant === "brand") {
    switch (brandType) {
      case "google":
        buttonStyle = { backgroundColor: Colors.googleBlue };
        textColor = Colors.textLight;
        break;
      case "apple":
        buttonStyle = { backgroundColor: Colors.appleBlack };
        textColor = Colors.textLight;
        break;
      case "kakao":
        buttonStyle = { backgroundColor: Colors.kakaoYellow };
        textColor = Colors.textDark; // 카카오는 검정 텍스트
        break;
    }
  } else if (variant === "default") {
    buttonStyle = styles.secondaryButton; // 갈색 (이메일 등)
    textColor = Colors.textLight;
  } else if (variant === "text") {
    buttonStyle = styles.textButton; // 배경 없음
    textColor = Colors.secondaryBrown;
  }

  return (
    <TouchableOpacity
      style={[styles.button, buttonStyle, style]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.buttonText,
          { color: textColor },
          variant === "text" ? styles.textButtonText : null,
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10, // 둥근 모서리
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginVertical: 10,
  },
  defaultButton: {
    backgroundColor: Colors.accentApricot,
  },
  secondaryButton: {
    backgroundColor: Colors.secondaryBrown,
  },
  textButton: {
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontSize: FontSizes.medium,
    fontWeight: FontWeights.bold,
  },
  textButtonText: {
    textDecorationLine: 'underline',
    fontWeight: FontWeights.medium,
  },
});

export default Button;
