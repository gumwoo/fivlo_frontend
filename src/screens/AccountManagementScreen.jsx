// src/screens/AccountManagementScreen.jsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackActions } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Header from '../components/common/Header';
import Button from '../components/common/Button';
import AccountDeleteModal from '../components/common/AccountDeleteModal';
import { Colors } from '../styles/color';
import { FontSizes, FontWeights } from '../styles/Fonts';

const AccountManagementScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const [name, setName] = useState('오분이');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // ✨ 수정: 저장 버튼 클릭 시 Alert을 띄운 후, 확인을 누르면 이전 화면으로 돌아갑니다.
  const handleSave = () => {
    Alert.alert(
      t('account.save_confirm_title'), 
      t('account.save_confirm_message'),
      [{ text: t('common.ok'), onPress: () => navigation.goBack() }]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      t('account.logout_confirm_title'),
      t('account.logout_confirm_message'),
      [
        { text: t('account.cancel'), style: 'cancel' },
        { text: t('account.confirm'), onPress: () => navigation.dispatch(StackActions.replace('AuthChoice')), style: 'destructive' },
      ]
    );
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    setShowDeleteModal(false);
    navigation.dispatch(StackActions.replace('AuthChoice'));
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top }]}>
      {/* ✨ 수정: 모든 텍스트를 번역 파일(t 함수)에 맞게 수정 */}
      <Header title={t('account.title')} showBackButton={true} />
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.imageContainer}>
          <Image 
            source={require('../../assets/images/obooni_default.png')}
            style={styles.profileImage}
          />
          <Text style={styles.imageChangeText}>{t('account.change_image')}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>{t('account.name')}</Text>
        <TextInput 
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>{t('account.account_info')}</Text>
        <Text style={styles.infoText}>(카카오톡/페이스북/이메일) 로그인</Text>
        <Text style={styles.infoText}>skyhan1114@naver.com</Text>

        <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
          <Text style={styles.actionText}>{t('account.logout')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleDeleteAccount}>
          <Text style={[styles.actionText, styles.deleteText]}>{t('account.delete_account')}</Text>
        </TouchableOpacity>
        
        <Text style={styles.label}>{t('account.fivlo_purpose')}</Text>
        <TouchableOpacity 
          style={styles.purposeBox} 
          onPress={() => navigation.navigate('PurposeSelection', { from: 'profile' })}
        >
          <Text style={styles.infoText}>{t('account.purpose_placeholder')}</Text>
        </TouchableOpacity>

      </ScrollView>
      <View style={styles.saveButtonContainer}>
        <Button title={t('account.save')} onPress={handleSave} />
      </View>
      
      {/* 회원 탈퇴 모달 */}
      <AccountDeleteModal
        visible={showDeleteModal}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: Colors.primaryBeige },
  container: { paddingHorizontal: 20, paddingBottom: 20, alignItems: 'center' },
  imageContainer: { alignItems: 'center', marginVertical: 20 },
  profileImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  imageChangeText: { fontSize: FontSizes.medium, color: Colors.secondaryBrown, textDecorationLine: 'underline' },
  label: { width: '100%', fontSize: FontSizes.medium, fontWeight: FontWeights.medium, color: Colors.textDark, marginBottom: 8, marginTop: 24 },
  input: { width: '100%', backgroundColor: Colors.textLight, borderRadius: 10, padding: 15, fontSize: FontSizes.medium, borderWidth: 1, borderColor: Colors.secondaryBrown },
  infoText: { width: '100%', fontSize: FontSizes.medium, color: Colors.secondaryBrown, marginTop: 5 },
  actionButton: { width: '100%', marginTop: 24, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.secondaryBrown+'50'},
  actionText: { fontSize: FontSizes.medium, color: Colors.textDark, fontWeight: '600' },
  deleteText: { color: Colors.accentRed },
  purposeBox: { 
  width: '100%',
  backgroundColor: Colors.textLight,
  borderRadius: 12,
  padding: 12,
  borderWidth: 2,
  borderColor: Colors.secondaryBrown,
  marginTop: 8
},
  saveButtonContainer: { position: 'absolute', bottom: 30, left: 0, right: 0, paddingHorizontal: 20, backgroundColor: Colors.primaryBeige },
});

export default AccountManagementScreen;