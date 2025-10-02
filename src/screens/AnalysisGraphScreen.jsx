// src/screens/AnalysisGraphScreen.jsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { format, addDays, subDays, addWeeks, subWeeks, addMonths, subMonths } from 'date-fns';
import { ko, enUS } from 'date-fns/locale';

// 공통 스타일 및 컴포넌트 임포트
import { GlobalStyles } from '../styles/GlobalStyles';
import { Colors } from '../styles/color';
import { FontSizes, FontWeights } from '../styles/Fonts';
import Header from '../components/common/Header';
import { useTranslation } from 'react-i18next';

// 각 분석 뷰 컴포넌트 임포트 (실제 프로젝트 경로에 맞게 확인 필요)
import DailyAnalysisView from './Analysis/DailyAnalysisView';
import WeeklyAnalysisView from './Analysis/WeeklyAnalysisView';
import MonthlyAnalysisView from './Analysis/MonthlyAnalysisView';
import DDayAnalysisView from './Analysis/DDayAnalysisView';

// AI 분석 제안서 뷰 컴포넌트
const AiAnalysisView = () => {
  return (
    <ScrollView contentContainerStyle={styles.aiContainer}>
      <View style={styles.aiHeader}>
        <Text style={styles.aiTitle}>오분이의 월간 ai 분석 제안서</Text>
        <Image 
          source={require('../../assets/기본오분이.png')} // 캐릭터 이미지 경로 확인 필요
          style={styles.aiCharacterImage} 
        />
      </View>

      <View style={styles.analysisRow}>
        <View style={styles.analysisBox}>
          <Text style={styles.boxTitle}>최적의 집중 시작 시간</Text>
          <Text style={[styles.mainText, {color: Colors.accentApricot}]}>AM 09 : 00</Text>
          <Text style={styles.subText}>포모도로 세트 수 : 3개</Text>
          <Text style={styles.subText}>포모도로 중간률 : 8%</Text>
          <Text style={styles.subText}>평균 집중 시간 : 48분</Text>
          <Text style={styles.bulletPoint}>→ 성공률도 높고, 이후 집중 흐름도 가장 안정적으로 유지</Text>
        </View>
        <View style={styles.analysisBox}>
          <Text style={styles.boxTitle}>최적의 집중 요일</Text>
          <Text style={[styles.mainText, {color: Colors.accentApricot}]}>수요일, 금요일</Text>
          <Text style={styles.subText}>✓ 수요일 평균 3.4세트, 성공률 92%, 평균 집중 95분</Text>
          <Text style={styles.subText}>✓ 금요일 평균 3.2세트, 성공률 88%, 평균 집중 87분</Text>
          <Text style={styles.bulletPoint}>→ 집중 시간이 길고, 실제 효율이 높은 요일</Text>
        </View>
      </View>

      <View style={styles.analysisRow}>
        <View style={styles.analysisBox}>
          <Text style={styles.boxTitle}>집중도가 낮은 시간</Text>
          <Text style={[styles.mainText, {color: Colors.textDark}]}>PM 13 : 00 ~ 14 : 00</Text>
          <Text style={styles.subText}>루틴 중단률 : 52%</Text>
          <Text style={styles.subText}>평균 집중 시간 : 33분</Text>
          <Text style={styles.subText}>세트 성공률 : 48%</Text>
          <Text style={styles.bulletPoint}>→ 이 시간에는 공식 루틴이나 가벼운 활동을 추천</Text>
        </View>
        <View style={styles.analysisBox}>
          <Text style={styles.boxTitle}>활동 시간 제안</Text>
          <Text style={[styles.subText, { color: Colors.textDark }]}>✓ 국제정치역사 공부 - AM 9시 ~ 11시</Text>
          <Text style={[styles.subText, { color: Colors.accentRed }]}>✓ 토익공부 - PM 3시 ~ 5시</Text>
          <Text style={[styles.subText, { color: Colors.textDark }]}>✓ 독서 하기 - AM 7시 ~ 9시</Text>
          <Text style={styles.bulletPoint}>→ 집중도를 기준, 국정사는 오전 88%, 토익은 오후 82%, 독서는 아침 91%로 가장 안정적</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const AnalysisGraphScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();

  const [activeTab, setActiveTab] = useState('monthly');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isPremiumUser, setIsPremiumUser] = useState(true);

  const handleDateNavigation = (direction) => {
    let newDate = currentDate;
    if (activeTab === 'daily') {
      newDate = direction === 'prev' ? subDays(currentDate, 1) : addDays(currentDate, 1);
    } else if (activeTab === 'weekly') {
      newDate = direction === 'prev' ? subWeeks(currentDate, 1) : addWeeks(currentDate, 1);
    } else if (activeTab === 'monthly') {
      newDate = direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1);
    }
    setCurrentDate(newDate);
  };

  const getFormattedDate = () => {
    const locale = i18n.language === 'ko' ? ko : enUS;
    if (activeTab === 'daily') {
      const pattern = i18n.language === 'ko' ? 'yyyy년 MM월 dd일 EEEE' : 'EEEE, MMM dd, yyyy';
      return format(currentDate, pattern, { locale });
    } else if (activeTab === 'weekly') {
      const startOfWeek = format(currentDate, i18n.language === 'ko' ? 'MM.dd' : 'MMM dd', { locale });
      const endOfWeek = format(addDays(currentDate, 6), i18n.language === 'ko' ? 'MM.dd' : 'MMM dd', { locale });
      return `${startOfWeek} - ${endOfWeek}`;
    } else if (activeTab === 'monthly') {
      const pattern = i18n.language === 'ko' ? 'yyyy년 MM월' : 'MMMM yyyy';
      return format(currentDate, pattern, { locale });
    }
    return '';
  };

  const handleDDayTabPress = () => {
    if (!isPremiumUser) {
      navigation.navigate('PremiumMembership');
    } else {
      setActiveTab('dday');
    }
  };

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top + 20 }]}>
      <Header title={t('analysis.title')} showBackButton={true} />

      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tabButton, activeTab === 'daily' && styles.tabButtonActive]} onPress={() => setActiveTab('daily')}>
          <Text style={[styles.tabText, activeTab === 'daily' && styles.tabTextActive]}>{t('analysis.tabs.daily')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabButton, activeTab === 'weekly' && styles.tabButtonActive]} onPress={() => setActiveTab('weekly')}>
          <Text style={[styles.tabText, activeTab === 'weekly' && styles.tabTextActive]}>{t('analysis.tabs.weekly')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabButton, activeTab === 'monthly' && styles.tabButtonActive]} onPress={() => setActiveTab('monthly')}>
          <Text style={[styles.tabText, activeTab === 'monthly' && styles.tabTextActive]}>{t('analysis.tabs.monthly')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabButton, activeTab === 'dday' && styles.tabButtonActive]} onPress={handleDDayTabPress}>
          <Text style={[styles.tabText, activeTab === 'dday' && styles.tabTextActive]}>{t('analysis.tabs.dday')}</Text>
          {!isPremiumUser && <FontAwesome5 name="lock" size={12} color={Colors.secondaryBrown} style={styles.lockIcon} />}
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabButton, activeTab === 'ai' && styles.tabButtonActive]} onPress={() => setActiveTab('ai')}>
          <Text style={[styles.tabText, activeTab === 'ai' && styles.tabTextActive]}>AI 분석</Text>
        </TouchableOpacity>
      </View>

      {activeTab !== 'dday' && activeTab !== 'ai' && (
        <View style={styles.dateNavigationContainer}>
          <TouchableOpacity onPress={() => handleDateNavigation('prev')} style={styles.dateNavButton}>
            <Text style={styles.dateNavButtonText}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.currentDateText}>{getFormattedDate()}</Text>
          <TouchableOpacity onPress={() => handleDateNavigation('next')} style={styles.dateNavButton}>
            <Text style={styles.dateNavButtonText}>{'>'}</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
        {activeTab === 'daily' && <DailyAnalysisView date={currentDate} />}
        {activeTab === 'weekly' && <WeeklyAnalysisView date={currentDate} />}
        {activeTab === 'monthly' && <MonthlyAnalysisView date={currentDate} />}
        {activeTab === 'dday' && <DDayAnalysisView isPremiumUser={isPremiumUser} />}
        {activeTab === 'ai' && <AiAnalysisView />}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.primaryBeige,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '95%',
    backgroundColor: Colors.textLight,
    borderRadius: 15,
    padding: 5,
    marginTop: 10,
    marginBottom: 20,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  tabButtonActive: {
    backgroundColor: Colors.accentApricot,
  },
  tabText: {
    fontSize: FontSizes.medium,
    color: Colors.secondaryBrown,
    fontWeight: FontWeights.medium,
  },
  tabTextActive: {
    color: Colors.textLight,
    fontWeight: FontWeights.bold,
  },
  lockIcon: {
    marginLeft: 5,
  },
  dateNavigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    paddingVertical: 10,
    marginBottom: 20,
    alignSelf: 'center',
  },
  dateNavButton: {
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  dateNavButtonText: {
    fontSize: FontSizes.extraLarge,
    fontWeight: FontWeights.bold,
    color: Colors.secondaryBrown,
  },
  currentDateText: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
  },
  scrollViewContentContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  
  // AI 분석 뷰를 위한 스타일
  aiContainer: {
    padding: 15,
  },
  aiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  aiTitle: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
  },
  aiCharacterImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  analysisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  analysisBox: {
    width: '48%',
    backgroundColor: Colors.textLight,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  boxTitle: {
    fontSize: FontSizes.small,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 10,
  },
  mainText: {
    fontSize: FontSizes.medium,
    fontWeight: FontWeights.bold,
    marginBottom: 10,
  },
  subText: {
    fontSize: 12,
    color: Colors.secondaryBrown,
    lineHeight: 18,
    marginBottom: 4,
  },
  bulletPoint: {
    fontSize: 12,
    color: Colors.secondaryBrown,
    marginTop: 10,
  },
});

export default AnalysisGraphScreen;