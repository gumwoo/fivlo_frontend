// src/components/timeattack/ConfirmExitModal.jsx
import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';

const ConfirmExitModal = ({ visible, onConfirm, onCancel, message = '오분이와 함께하는 집중 시간을 끝내시겠습니까?' }) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Image source={require('../../../assets/타임어택.png')} style={styles.icon} />
          <Text style={styles.message}>{message}</Text>
          <View style={styles.row}>
            <TouchableOpacity style={[styles.btn, styles.btnGhost]} onPress={onCancel}>
              <Text style={[styles.btnText, styles.btnGhostText]}>아니요</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={onConfirm}>
              <Text style={[styles.btnText, styles.btnPrimaryText]}>예</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
  card: { width: '80%', backgroundColor: Colors.textLight, borderRadius: 16, paddingHorizontal: 18, paddingVertical: 16, alignItems: 'center' },
  icon: { width: 48, height: 48, marginBottom: 10 },
  message: { fontSize: FontSizes.medium, color: Colors.textDark, textAlign: 'center', marginBottom: 14 },
  row: { flexDirection: 'row', gap: 10 },
  btn: { flex: 1, borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  btnGhost: { backgroundColor: 'transparent', borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)' },
  btnPrimary: { backgroundColor: Colors.accentApricot },
  btnText: { fontSize: FontSizes.medium, fontWeight: FontWeights.bold },
  btnGhostText: { color: Colors.textDark },
  btnPrimaryText: { color: Colors.textLight },
});

export default ConfirmExitModal;

