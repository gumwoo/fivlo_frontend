// src/components/common/Typography.jsx
import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';

// variants: h1, h2, h3, subtitle, body, caption
const Typography = ({ variant = 'body', color = Colors.textDark, style, children, ...props }) => {
  const variantStyle = styles[variant] || styles.body;
  return (
    <Text style={[variantStyle, { color }, style]} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  h1: { fontSize: FontSizes.extraLarge, fontWeight: FontWeights.bold },
  h2: { fontSize: FontSizes.large, fontWeight: FontWeights.bold },
  h3: { fontSize: FontSizes.medium, fontWeight: FontWeights.medium },
  subtitle: { fontSize: FontSizes.medium, fontWeight: FontWeights.medium, opacity: 0.9 },
  body: { fontSize: FontSizes.medium, fontWeight: FontWeights.regular },
  caption: { fontSize: FontSizes.small, fontWeight: FontWeights.regular, opacity: 0.75 },
});

export default Typography;

