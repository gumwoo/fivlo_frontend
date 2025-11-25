import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Alert, Modal } from 'react-native';
import { useNavigation, StackActions } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';
import Header from '../components/common/Header';
import Button from '../components/common/Button';
import AccountDeleteModal from '../components/common/AccountDeleteModal';
import { Colors } from '../styles/color';
import { FontSizes, FontWeights } from '../styles/Fonts';
import useAuthStore from '../store/authStore';
import { getUserProfile, updateUserProfile, logout as logoutApi } from '../utils/api';

const AccountManagementScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const {
    userPurpose,
    userProfileImage,
    userNickname,
    userCoins,
    setUserProfileImage,
    setUserProfile
  } = useAuthStore();

  const [name, setName] = useState(userNickname || '오분이');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showImagePickerModal, setShowImagePickerModal] = useState(false);

  // 화면 진입 시 사용자 프로필 조회
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getUserProfile();
        if (__DEV__) {
          console.log('[AccountManagement] Profile loaded:', profileData);
        }
        setUserProfile(profileData);
        if (profileData.nickname) {
          setName(profileData.nickname);
        }
      } catch (error) {
        console.error('[AccountManagement] Failed to load profile:', error);
      }
    };

    fetchProfile();
  }, []);

  // 목적을 한글로 변환
  const getPurposeText = () => {
    if (!userPurpose) return t('account.purpose_placeholder');

    const purposeMap = {
      'concentration': t('core.purpose_concentration'),
      'routine': t('core.purpose_routine'),
      'goal': t('core.purpose_goal'),
      '집중_관리': t('core.purpose_concentration'),
      '루틴_형성': t('core.purpose_routine'),
      '목표_관리': t('core.purpose_goal'),
    };

    return purposeMap[userPurpose] || userPurpose;
  };

  // 이미지 선택 Modal 열기
  const handleImagePress = () => {
    setShowImagePickerModal(true);
  };

  // 카메라로 촬영
  const handleCamera = async () => {
    setShowImagePickerModal(false);

    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          t('account.permission_required'),
          t('account.camera_permission_message')
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await setUserProfileImage(result.assets[0].uri);
        if (__DEV__) {
          console.log('[AccountManagement] Image captured:', result.assets[0].uri);
        }
      }
    } catch (error) {
      console.error('[AccountManagement] Camera error:', error);
      Alert.alert(t('common.error'), t('account.image_error'));
    }
  };

  // 갤러리에서 선택
  const handleGallery = async () => {
    setShowImagePickerModal(false);

    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          t('account.permission_required'),
          t('account.gallery_permission_message')
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await setUserProfileImage(result.assets[0].uri);
        if (__DEV__) {
          console.log('[AccountManagement] Image selected:', result.assets[0].uri);
        }
      }
    } catch (error) {
      console.error('[AccountManagement] Gallery error:', error);
      Alert.alert(t('common.error'), t('account.image_error'));
    }
  };

  const handleSave = async () => {
    try {
      // API 호출하여 프로필 업데이트
      await updateUserProfile(name, userProfileImage);

      // 성공 시 스토어 업데이트 (이미지는 이미 업데이트됨)
      setUserProfile({
        nickname: name,
        profileImageUrl: userProfileImage,
        onboardingType: userPurpose,
        isPremium: useAuthStore.getState().isPremiumUser,
        totalCoins: userCoins
      });

      Alert.alert(
        t('account.save_confirm_title'),
        '프로필 정보가 성공적으로 수정되었습니다.',
        [{ text: t('common.ok'), onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('[AccountManagement] Failed to update profile:', error);
      Alert.alert(t('common.error'), '프로필 수정에 실패했습니다.');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      t('account.logout_confirm_title'),
      t('account.logout_confirm_message'),
      [
        { text: t('account.cancel'), style: 'cancel' },
        {
          text: t('account.confirm'), onPress: async () => {
            try {
              // API 로그아웃 호출
              const { refreshToken, logout } = useAuthStore.getState();
              if (refreshToken) {
                await logoutApi(refreshToken);
                if (__DEV__) {
                  console.log('[AccountManagement] Logout API called successfully');
                }
              }
            } catch (error) {
              console.error('[AccountManagement] Logout API failed:', error);
              // API 호출 실패해도 클라이언트 로그아웃은 진행
            } finally {
              // 클라이언트 로그아웃 처리
              const { logout } = useAuthStore.getState();
              await logout();
              navigation.dispatch(StackActions.replace('AuthChoice'));
            }
          }, style: 'destructive'
        },
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
      <Header title={t('account.title')} showBackButton={true} />
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.imageContainer} onPress={handleImagePress}>
          <Image
            source={
              userProfileImage
                ? { uri: userProfileImage }
                : require('../../assets/기본오분이.png')
            }
            style={styles.profileImage}
          />
          <Text style={styles.imageChangeText}>{t('account.change_image')}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>{t('account.name')}</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          editable={true}
        />

        <Text style={styles.label}>{t('account.account_info')}</Text>
        <Text style={styles.infoText}>이메일 로그인</Text>

        <Text style={styles.label}>보유 코인</Text>
        <Text style={styles.infoText}>{userCoins} 코인</Text>

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
          <Text style={[styles.infoText, userPurpose && styles.selectedPurposeText]}>
            {getPurposeText()}
          </Text>
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

      {/* 이미지 선택 모달 */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showImagePickerModal}
        onRequestClose={() => setShowImagePickerModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('account.select_image_source')}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={handleCamera}>
              <Text style={styles.modalButtonText}>{t('account.take_photo')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={handleGallery}>
              <Text style={styles.modalButtonText}>{t('account.choose_from_gallery')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setShowImagePickerModal(false)}
            >
              <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  actionButton: { width: '100%', marginTop: 24, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.secondaryBrown + '50' },
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
  selectedPurposeText: {
    color: Colors.textDark,
    fontWeight: FontWeights.bold,
  },
  saveButtonContainer: { position: 'absolute', bottom: 30, left: 0, right: 0, paddingHorizontal: 20, backgroundColor: Colors.primaryBeige },
  // 이미지 선택 Modal 스타일
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.primaryBeige,
    borderRadius: 20,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 24,
  },
  modalButton: {
    width: '100%',
    backgroundColor: Colors.secondaryBrown,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: FontSizes.medium,
    fontWeight: FontWeights.medium,
    color: Colors.textLight,
  },
  cancelButton: {
    backgroundColor: Colors.secondaryBrown,
  },
  cancelButtonText: {
    fontSize: FontSizes.medium,
    fontWeight: FontWeights.medium,
    color: Colors.textLight,
  },
});

export default AccountManagementScreen;