// src/components/timeattack/ConfirmExitModal.jsx
import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';

const ConfirmExitModal = ({ visible, onConfirm, onCancel, message }) => {
  const { t } = useTranslation();
  
  const displayMessage = message || t('timeattack.exit_confirm_message');
  
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Image source={require('../../../assets/타임어택_오분이.gif')} style={styles.icon} />
          <Text style={styles.message}>{displayMessage}</Text>
          <View style={styles.row}>
            <TouchableOpacity style={[styles.btn, styles.btnSecondary]} onPress={onCancel}>
              <Text style={[styles.btnText, styles.btnSecondaryText]}>{t('common.no')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={onConfirm}>
              <Text style={[styles.btnText, styles.btnPrimaryText]}>{t('common.yes')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { 
    flex: 1, 
    backgroundColor: 'rgba(51, 51, 51, 0.7)', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  card: { 
    width: '85%', 
    backgroundColor: Colors.primaryBeige, 
    borderRadius: 24, 
    paddingHorizontal: 24, 
    paddingVertical: 28, 
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.secondaryBrown,
  },
  icon: { 
    width: 80, 
    height: 80, 
    marginBottom: 16 
  },
  message: { 
    fontSize: FontSizes.large, 
    fontWeight: FontWeights.medium,
    color: Colors.textDark, 
    textAlign: 'center', 
    marginBottom: 24,
    lineHeight: 28,
  },
  row: { 
    flexDirection: 'row', 
    gap: 12,
    width: '100%',
  },
  btn: { 
    flex: 1, 
    borderRadius: 12, 
    paddingVertical: 14, 
    alignItems: 'center',
  },
  btnSecondary: { 
    backgroundColor: Colors.secondaryBrown,
  },
  btnPrimary: { 
    backgroundColor: Colors.accentApricot 
  },
  btnText: { 
    fontSize: FontSizes.medium, 
    fontWeight: FontWeights.bold 
  },
  btnSecondaryText: { 
    color: Colors.textLight 
  },
  btnPrimaryText: { 
    color: Colors.textLight 
  },
});

export default ConfirmExitModal;
