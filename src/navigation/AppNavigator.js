// src/navigation/AppNavigator.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';

// --- 화면 컴포넌트 전체 임포트 ---

// 1. 온보딩 및 인증
import OnboardingScreen from '../screens/OnboardingScreen';
import AuthChoiceScreen from '../screens/Auth/AuthChoiceScreen';
import EmailSignUpScreen from '../screens/Auth/EmailSignUpScreen';
import EmailLoginScreen from '../screens/Auth/EmailLoginScreen';
import PurposeSelectionScreen from '../screens/PurposeSelectionScreen';
import LanguageSelectionScreen from '../screens/LanguageSelectionScreen';

// 2. 메인 탭 화면
import HomeScreen from '../screens/HomeScreen';
import FeaturesScreen from '../screens/FeaturesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import Header from '../components/common/Header';
import AccountManagementScreen from '../screens/AccountManagementScreen';
import InformationScreen from '../screens/InformationScreen';
import PremiumMembershipScreen from '../screens/PremiumMembershipScreen';

// 3. Task (할 일)
import TaskCalendarScreen from '../screens/Task/TaskCalendarScreen';
import TaskDetailModal from '../screens/Task/TaskDetailModal';
import TaskCompleteCoinModal from '../screens/Task/TaskCompleteCoinModal';
import TaskEditModal from '../screens/Task/TaskEditModal';
import TaskDeleteConfirmModal from '../screens/Task/TaskDeleteConfirmModal';
// ⚠️ 파일 이름은 유지하되, 컴포넌트 이름을 Screen으로 변경하여 임포트합니다.
import CategorySettingScreen from '../screens/Task/CategorySettingModal';
import CategoryEditScreen from '../screens/Task/CategoryEditModal';

// 4. 포모도로
import PomodoroScreen from '../screens/Pomodoro/PomodoroScreen';
import PomodoroGoalCreationScreen from '../screens/Pomodoro/PomodoroGoalCreationScreen';
import PomodoroTimerScreen from '../screens/Pomodoro/PomodoroTimerScreen';
import PomodoroPauseScreen from '../screens/Pomodoro/PomodoroPauseScreen';
import PomodoroResetConfirmModal from '../screens/Pomodoro/PomodoroResetConfirmModal';
import PomodoroBreakChoiceScreen from '../screens/Pomodoro/PomodoroBreakChoiceScreen';
import PomodoroCycleCompleteScreen from '../screens/Pomodoro/PomodoroCycleCompleteScreen';
import PomodoroFinishScreen from '../screens/Pomodoro/PomodoroFinishScreen';
import PomodoroStopScreen from '../screens/Pomodoro/PomodoroStopScreen';

// 5. 타임어택
import TimeAttackScreen from '../screens/TimeAttack/TimeAttackScreen';
import TimeAttackGoalSettingScreen from '../screens/TimeAttack/TimeAttackGoalSettingScreen';
import TimeAttackTimeInputModal from '../screens/TimeAttack/TimeAttackTimeInputModal';
import TimeAttackAISubdivisionScreen from '../screens/TimeAttack/TimeAttackAISubdivisionScreen';
import TimeAttackInProgressScreen from '../screens/TimeAttack/TimeAttackInProgressScreen';
import TimeAttackCompleteScreen from '../screens/TimeAttack/TimeAttackCompleteScreen';

// 6. 성장 앨범
import GrowthAlbumScreen from '../screens/Album/GrowthAlbumScreen';
import PhotoUploadModal from '../screens/Album/PhotoUploadModal';
import GrowthAlbumCalendarView from '../screens/Album/GrowthAlbumCalendarView';
import GrowthAlbumCategoryView from '../screens/Album/GrowthAlbumCategoryView';

// 7. 망각방지 알림
import ReminderScreen from '../screens/Reminder/ReminderScreen';
import ReminderAddEditScreen from '../screens/Reminder/ReminderAddEditScreen';
import ReminderTimeSettingModal from '../screens/Reminder/ReminderTimeSettingModal';
import ReminderLocationSettingScreen from '../screens/Reminder/ReminderLocationSettingScreen';
import ReminderChecklistScreen from '../screens/Reminder/ReminderChecklistScreen';
import ReminderLocationAlertModal from '../screens/Reminder/ReminderLocationAlertModal';
import ReminderCompleteCoinModal from '../screens/Reminder/ReminderCompleteCoinModal';

// 8. 집중도 분석
import AnalysisGraphScreen from '../screens/AnalysisGraphScreen';
import DailyAnalysisView from '../screens/Analysis/DailyAnalysisView';
import WeeklyAnalysisView from '../screens/Analysis/WeeklyAnalysisView';
import MonthlyAnalysisView from '../screens/Analysis/MonthlyAnalysisView';
import DDayAnalysisView from '../screens/Analysis/DDayAnalysisView';

// 9. 오분이 커스터마이징
import ObooniCustomizationScreen from '../screens/Obooni/ObooniCustomizationScreen';
import ObooniClosetScreen from '../screens/Obooni/ObooniClosetScreen';
import ObooniOwnedItemsScreen from '../screens/Obooni/ObooniOwnedItemsScreen';
import ObooniShopScreen from '../screens/Obooni/ObooniShopScreen';

// 10. 목표 세분화
import RoutineSettingScreen from '../screens/RoutineSettingScreen';


// 스타일 임포트
import { Colors } from '../styles/color';
import { FontSizes, FontWeights } from '../styles/Fonts';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TempScreen = ({ route }) => (
  <View style={{ flex: 1, backgroundColor: Colors.primaryBeige, justifyContent: 'center', alignItems: 'center' }}>
    <Header title={route.name} showBackButton={true} />
    <Text style={{ fontSize: FontSizes.large }}>{route.name} Screen</Text>
  </View>
);

// 메인 탭 내비게이터 (하단 탭바)
const MainTabNavigator = () => {
  const { t } = useTranslation();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'GrowthAlbumTab') {
            iconName = focused ? 'image' : 'image-outline';
          } else if (route.name === 'FeaturesTab') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'SettingsTab') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else {
            iconName = 'help-circle-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.accentApricot,
        tabBarInactiveTintColor: Colors.secondaryBrown,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.primaryBeige,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          position: 'absolute',
          bottom: 0,
          height: 80,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.1,
          shadowRadius: 5,
          elevation: 5,
        },
        tabBarLabelStyle: {
          fontSize: FontSizes.small,
          fontWeight: FontWeights.medium,
          marginTop: -5,
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ tabBarLabel: t('tabs.home') }} />
      <Tab.Screen name="GrowthAlbumTab" component={GrowthAlbumScreen} options={{ tabBarLabel: t('tabs.growth_album') }} />
      <Tab.Screen name="FeaturesTab" component={FeaturesScreen} options={{ tabBarLabel: t('tabs.features') }} />
      <Tab.Screen name="SettingsTab" component={SettingsScreen} options={{ tabBarLabel: t('tabs.settings') }} />
    </Tab.Navigator>
  );
};

// 앱 전체 스택 내비게이터
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Onboarding" screenOptions={{ headerShown: false }}>
        {/* 온보딩 및 인증 플로우 */}
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="AuthChoice" component={AuthChoiceScreen} />
        <Stack.Screen name="EmailSignUp" component={EmailSignUpScreen} />
        <Stack.Screen name="EmailLogin" component={EmailLoginScreen} />
        <Stack.Screen name="LanguageSelection" component={LanguageSelectionScreen} />
        <Stack.Screen name="PurposeSelection" component={PurposeSelectionScreen} />
        
        {/* 메인 탭 진입 */}
        <Stack.Screen name="Main" component={MainTabNavigator} />
        
        {/* 기능별 전체 화면 */}
        <Stack.Screen name="RoutineSetting" component={RoutineSettingScreen} />
        <Stack.Screen name="AnalysisGraph" component={AnalysisGraphScreen} />
        <Stack.Screen name="AccountManagement" component={AccountManagementScreen} />
        <Stack.Screen name="Pomodoro" component={PomodoroScreen} />
        <Stack.Screen name="Reminder" component={ReminderScreen} />
        <Stack.Screen name="PremiumMembership" component={PremiumMembershipScreen} />
        <Stack.Screen name="Information" component={InformationScreen} />
        
        {/* Task 관련 화면들 */}
        <Stack.Screen name="TaskCalendar" component={TaskCalendarScreen} />
        <Stack.Screen 
          name="TaskDetailModal" 
          component={TaskDetailModal} 
          options={{ 
            presentation: 'transparentModal',
            cardStyle: { backgroundColor: 'transparent' },
            gestureEnabled: true,
            headerShown: false,
          }} 
        />
        <Stack.Screen name="TaskEditModal" component={TaskEditModal} options={{ presentation: 'modal' }} />
        
        {/* ⚠️ Category 화면들을 일반 화면으로 등록 */}
        <Stack.Screen name="CategorySetting" component={CategorySettingScreen} />
        <Stack.Screen name="CategoryEdit" component={CategoryEditScreen} />

        {/* TimeAttack */}
        <Stack.Screen name="TimeAttack" component={TimeAttackScreen} />
        <Stack.Screen name="TimeAttackGoalSettingScreen" component={TimeAttackGoalSettingScreen} />
        <Stack.Screen name="TimeAttackTimeInputModal" component={TimeAttackTimeInputModal} options={{ presentation: 'modal' }} />
        <Stack.Screen name="TimeAttackAISubdivisionScreen" component={TimeAttackAISubdivisionScreen} />
        <Stack.Screen name="TimeAttackInProgress" component={TimeAttackInProgressScreen} />
        <Stack.Screen name="TimeAttackComplete" component={TimeAttackCompleteScreen} />

        {/* 나머지 임시 화면 */}
        <Stack.Screen name="Report" component={TempScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;