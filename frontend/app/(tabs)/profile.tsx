import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  Dimensions 
} from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../config/firebase';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Spacing, Radius, Typography, Palettes } from '../../constants/Theme';
import { Svg, Path, Line, G } from 'react-native-svg';
import * as shape from 'd3-shape';
import * as scale from 'd3-scale';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const router = useRouter();
  const { colors, mode, setMode } = useTheme();
  const { profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    refreshProfile();
  }, []);

  function handleSignOut() {
    Alert.alert("Sign Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: () => auth.signOut() }
    ]);
  }

  // MOCK DATA FOR THE TREND CHARTS
  const weeklyMinutes = [30, 45, 25, 60, 55, 75, 90];
  const fluencyTrend = [60, 62, 65, 64, 68, 70, 72];

  const badges = [
    { id: 1, icon: 'flame', color: '#F97316', label: '7 Day Streak' },
    { id: 2, icon: 'mic', color: '#3B52FF', label: '100 Min Speak' },
    { id: 3, icon: 'star', color: '#EAB308', label: 'A1 Achieved' },
    { id: 4, icon: 'book', color: '#10B981', label: 'Vocab Master' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* 1) PREMIUM PROFILE HEADER */}
        <View style={styles.header}>
          <View style={[styles.avatarBox, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>{profile?.name?.charAt(0) || 'U'}</Text>
          </View>
          <View style={styles.headerText}>
            <View style={styles.nameRow}>
              <Text style={[styles.userName, { color: colors.text }]}>{profile?.name || 'Learner'}</Text>
              <View style={[styles.levelPill, { backgroundColor: colors.accent }]}>
                <Text style={styles.levelText}>{profile?.cefr_level || 'A1'}</Text>
              </View>
            </View>
            <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{profile?.email}</Text>
          </View>
          <TouchableOpacity style={styles.settingsBtn}>
            <Ionicons name="settings-outline" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* 1.5) PREMIUM FLUENCY JOURNEY (NEW) */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Fluency Journey</Text>
          <View style={[styles.journeyCard, { backgroundColor: colors.surface }]}>
            <View style={styles.journeyTrack}>
              {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((lvl, i) => {
                const isCompleted = i <= (['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].indexOf(profile?.cefr_level || 'A1'));
                const isCurrent = lvl === (profile?.cefr_level || 'A1');
                return (
                  <View key={lvl} style={styles.journeyStep}>
                    <View style={[
                      styles.stepNode, 
                      { backgroundColor: isCompleted ? colors.primary : colors.border },
                      isCurrent && { borderWidth: 3, borderColor: colors.primary + '40', padding: 2 }
                    ]}>
                      {isCompleted && <Ionicons name="checkmark" size={12} color="#FFF" />}
                    </View>
                    <Text style={[
                      styles.stepLabel, 
                      { color: isCurrent ? colors.primary : colors.textSecondary, fontWeight: isCurrent ? '800' : '600' }
                    ]}>{lvl}</Text>
                  </View>
                );
              })}
              <View style={[styles.trackLine, { backgroundColor: colors.border }]} />
              <View style={[
                styles.trackFill, 
                { 
                  backgroundColor: colors.primary, 
                  width: `${(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].indexOf(profile?.cefr_level || 'A1') / 5) * 100}%` 
                }
              ]} />
            </View>
          </View>
        </View>

        {/* 2) HERO ACTIVITY CHART (Speaking Minutes) */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Weekly Speaking Activity</Text>
          <View style={[styles.chartCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.chartHeader}>
               <Text style={styles.chartVal}>7.4 hrs</Text>
               <Text style={styles.chartSub}>Total Spoken This Week</Text>
            </View>
            <View style={{ height: 120 }}>
              <Svg height="100%" width="100%">
                {/* Horizontal Grid lines */}
                {[0, 25, 50, 75, 100].map((tick) => (
                  <Line
                    key={tick}
                    x1="0"
                    y1={100 - tick}
                    x2="100%"
                    y2={100 - tick}
                    stroke={colors.border}
                    strokeWidth="0.5"
                  />
                ))}
                {(() => {
                  const padding = 20;
                  const chartWidth = width - Spacing.lg * 2 - padding * 2;
                  const chartHeight = 120 - padding * 2;
                  
                  const xScale = scale.scaleLinear()
                    .domain([0, weeklyMinutes.length - 1])
                    .range([padding, chartWidth + padding]);
                    
                  const yScale = scale.scaleLinear()
                    .domain([0, Math.max(...weeklyMinutes)])
                    .range([chartHeight + padding, padding]);
                    
                   const lineGenerator = shape.line<number>()
                    .x((_: number, i: number) => xScale(i))
                    .y((d: number) => yScale(d))
                    .curve(shape.curveNatural);
                    
                  return (
                    <Path
                      d={lineGenerator(weeklyMinutes) || ''}
                      stroke={colors.primary}
                      strokeWidth="3"
                      fill="none"
                    />
                  );
                })()}
              </Svg>
            </View>
            <View style={styles.weeksLabels}>
                {['M','T','W','T','F','S','S'].map((d, i) => (
                  <Text key={i} style={styles.weekText}>{d}</Text>
                ))}
            </View>
          </View>
        </View>

        {/* 3) METRICS GRID */}
        <View style={styles.metricsGrid}>
          <View style={[styles.metricCard, { backgroundColor: '#F0FDFA' }]}>
            <Ionicons name="time" size={20} color={colors.accent} />
            <Text style={styles.metricVal}>442m</Text>
            <Text style={styles.metricLabel}>Total Mins</Text>
          </View>
          <View style={[styles.metricCard, { backgroundColor: '#EFF6FF' }]}>
            <Ionicons name="checkbox" size={20} color={colors.primary} />
            <Text style={styles.metricVal}>24</Text>
            <Text style={styles.metricLabel}>Lessons</Text>
          </View>
          <View style={[styles.metricCard, { backgroundColor: '#F5F3FF' }]}>
            <Ionicons name="trending-up" size={20} color="#8B5CF6" />
            <Text style={styles.metricVal}>+12%</Text>
            <Text style={styles.metricLabel}>Fluency Inc</Text>
          </View>
          <View style={[styles.metricCard, { backgroundColor: '#FFF7ED' }]}>
            <Ionicons name="star" size={20} color="#F97316" />
            <Text style={styles.metricVal}>4.8</Text>
            <Text style={styles.metricLabel}>Avg Score</Text>
          </View>
        </View>

        {/* 4) MILESTONE BADGES */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Unlocked Milestones</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.badgeRow}>
            {badges.map((b) => (
              <View key={b.id} style={styles.badgeContainer}>
                <View style={[styles.badgeCircle, { backgroundColor: b.color + '15', borderColor: b.color + '30' }]}>
                  <Ionicons name={b.icon as any} size={28} color={b.color} />
                </View>
                <Text style={styles.badgeLabel}>{b.label}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* 5) ACCOUNT & THEME */}
        <View style={styles.section}>
           <Text style={[styles.sectionTitle, { color: colors.text }]}>Settings & Appearance</Text>
           <View style={[styles.menu, { backgroundColor: colors.surface, borderColor: colors.border }]}>
             <TouchableOpacity style={styles.menuItem} onPress={() => setMode(mode === 'dark' ? 'light' : 'dark')}>
                <Ionicons name={mode === 'dark' ? "moon" : "sunny"} size={22} color={colors.primary} />
                <Text style={[styles.menuText, { color: colors.text }]}>Dark Mode</Text>
                <View style={[styles.toggle, { backgroundColor: mode === 'dark' ? colors.primary : '#E2E8F0' }]}>
                   <View style={[styles.toggleDot, mode === 'dark' && { marginLeft: 'auto' }]} />
                </View>
             </TouchableOpacity>
             <View style={styles.divider} />
             <TouchableOpacity style={styles.menuItem} onPress={handleSignOut}>
                <Ionicons name="log-out-outline" size={22} color="#EF4444" />
                <Text style={[styles.menuText, { color: '#EF4444' }]}>Sign Out</Text>
             </TouchableOpacity>
           </View>
        </View>

        <Text style={[styles.versionText, { color: colors.textSecondary }]}>EchoFluent Premium v2.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.md,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    marginTop: Spacing.sm,
  },
  avatarBox: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Palettes.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFF',
  },
  headerText: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  levelPill: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 8,
  },
  levelText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '900',
  },
  userEmail: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 2,
  },
  settingsBtn: {
    padding: 10,
  },
  // CHART SECTION
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: Spacing.md,
  },
  chartCard: {
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  chartHeader: {
    marginBottom: 10,
  },
  chartVal: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E1B4B',
  },
  chartSub: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  weeksLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 8,
  },
  weekText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
  },
  // METRICS GRID
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  metricCard: {
    width: (width - Spacing.md * 3) / 2,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    alignItems: 'center',
  },
  metricVal: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E1B4B',
    marginTop: 8,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 2,
  },
  // BADGES
  badgeRow: {
    gap: Spacing.lg,
    paddingRight: Spacing.lg,
  },
  badgeContainer: {
    alignItems: 'center',
    gap: 8,
  },
  badgeCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  badgeLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
  },
  // MENU
  menu: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
    justifyContent: 'center',
  },
  toggleDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFF',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  versionText: {
    textAlign: 'center',
    marginTop: Spacing.xl,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
  },
  // JOURNEY
  journeyCard: {
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    paddingVertical: 32,
    shadowColor: 'rgba(59, 82, 255, 0.1)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 2,
  },
  journeyTrack: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
  },
  trackLine: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    height: 3,
    borderRadius: 1.5,
    zIndex: 0,
  },
  trackFill: {
    position: 'absolute',
    top: 10,
    left: 10,
    height: 3,
    borderRadius: 1.5,
    zIndex: 1,
  },
  journeyStep: {
    alignItems: 'center',
    zIndex: 2,
    width: 40,
  },
  stepNode: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepLabel: {
    fontSize: 11,
  }
});
