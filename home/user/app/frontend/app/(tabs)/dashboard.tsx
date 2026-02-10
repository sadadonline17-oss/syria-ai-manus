import GoldenEagle from '@/components/icons/GoldenEagle';
import { IMPERIAL } from '@/lib/theme';
import {
  UsersIcon,
  MessageSquareIcon,
  ZapIcon,
  TrendingUpIcon,
  ActivityIcon,
  ServerIcon,
  DatabaseIcon,
  ShieldCheckIcon,
} from 'lucide-react-native';
import { View, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const stats = [
  { icon: UsersIcon, label: 'المستخدمون', value: '2,847', change: '+12%', up: true },
  { icon: MessageSquareIcon, label: 'المحادثات', value: '18,392', change: '+28%', up: true },
  { icon: ZapIcon, label: 'المهام المنجزة', value: '5,214', change: '+35%', up: true },
  { icon: TrendingUpIcon, label: 'معدل النجاح', value: '94.7%', change: '+2.1%', up: true },
];

const systemStatus = [
  { icon: ServerIcon, label: 'حالة الخادم', status: 'متصل', ok: true },
  { icon: DatabaseIcon, label: 'قاعدة البيانات', status: 'Supabase', ok: true },
  { icon: ShieldCheckIcon, label: 'الأمان', status: 'OAuth2 + 2FA', ok: true },
  { icon: ActivityIcon, label: 'زمن الاستجابة', status: '45ms', ok: true },
];

const chartBars = [
  { label: 'سبت', h: 30 },
  { label: 'أحد', h: 55 },
  { label: 'اثن', h: 40 },
  { label: 'ثلا', h: 70 },
  { label: 'أرب', h: 60 },
  { label: 'خمي', h: 85 },
  { label: 'جمع', h: 50 },
];

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: IMPERIAL.background }}
      contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={{
          paddingHorizontal: 16,
          marginBottom: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: IMPERIAL.accent,
            borderWidth: 1,
            borderColor: IMPERIAL.border,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <GoldenEagle size={22} />
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ fontSize: 22, fontWeight: '700', color: IMPERIAL.gold }}>لوحة التحكم</Text>
          <Text style={{ fontSize: 12, color: IMPERIAL.textTertiary }}>إدارة النظام والإحصائيات</Text>
        </View>
      </View>

      <View style={{ paddingHorizontal: 16, gap: 10, marginBottom: 24 }}>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {stats.slice(0, 2).map((s) => {
            const Icon = s.icon;
            return (
              <View
                key={s.label}
                style={{
                  flex: 1,
                  backgroundColor: IMPERIAL.card,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: IMPERIAL.border,
                  padding: 14,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <Text style={{ fontSize: 11, color: IMPERIAL.success, fontWeight: '600' }}>{s.change}</Text>
                  <Icon size={18} color={IMPERIAL.gold} />
                </View>
                <Text style={{ fontSize: 22, fontWeight: '700', color: IMPERIAL.text, textAlign: 'right' }}>
                  {s.value}
                </Text>
                <Text style={{ fontSize: 12, color: IMPERIAL.textTertiary, textAlign: 'right', marginTop: 2 }}>
                  {s.label}
                </Text>
              </View>
            );
          })}
        </View>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {stats.slice(2).map((s) => {
            const Icon = s.icon;
            return (
              <View
                key={s.label}
                style={{
                  flex: 1,
                  backgroundColor: IMPERIAL.card,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: IMPERIAL.border,
                  padding: 14,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <Text style={{ fontSize: 11, color: IMPERIAL.success, fontWeight: '600' }}>{s.change}</Text>
                  <Icon size={18} color={IMPERIAL.gold} />
                </View>
                <Text style={{ fontSize: 22, fontWeight: '700', color: IMPERIAL.text, textAlign: 'right' }}>
                  {s.value}
                </Text>
                <Text style={{ fontSize: 12, color: IMPERIAL.textTertiary, textAlign: 'right', marginTop: 2 }}>
                  {s.label}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
        <Text style={{ fontSize: 16, fontWeight: '700', color: IMPERIAL.gold, textAlign: 'right', marginBottom: 12 }}>
          نشاط الأسبوع
        </Text>
        <View
          style={{
            backgroundColor: IMPERIAL.card,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: IMPERIAL.border,
            padding: 16,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', height: 100 }}>
            {chartBars.map((bar) => (
              <View key={bar.label} style={{ alignItems: 'center', gap: 6 }}>
                <View
                  style={{
                    width: 24,
                    height: bar.h,
                    borderRadius: 6,
                    backgroundColor: IMPERIAL.gold,
                    opacity: 0.8,
                  }}
                />
                <Text style={{ fontSize: 10, color: IMPERIAL.textTertiary }}>{bar.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={{ paddingHorizontal: 16 }}>
        <Text style={{ fontSize: 16, fontWeight: '700', color: IMPERIAL.gold, textAlign: 'right', marginBottom: 12 }}>
          حالة النظام
        </Text>
        <View
          style={{
            backgroundColor: IMPERIAL.card,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: IMPERIAL.border,
            overflow: 'hidden',
          }}
        >
          {systemStatus.map((item, index) => {
            const Icon = item.icon;
            return (
              <View
                key={item.label}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 14,
                  borderBottomWidth: index < systemStatus.length - 1 ? 1 : 0,
                  borderBottomColor: IMPERIAL.border,
                  gap: 10,
                }}
              >
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: item.ok ? IMPERIAL.success : IMPERIAL.error,
                  }}
                />
                <Text style={{ fontSize: 13, color: IMPERIAL.textSecondary, flex: 0 }}>{item.status}</Text>
                <View style={{ flex: 1 }} />
                <Text style={{ fontSize: 14, fontWeight: '600', color: IMPERIAL.text }}>{item.label}</Text>
                <Icon size={18} color={IMPERIAL.gold} />
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}
