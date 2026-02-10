import GoldenEagle from '@/components/icons/GoldenEagle';
import { IMPERIAL } from '@/lib/theme';
import {
  ChevronLeftIcon,
  UserIcon,
  BellIcon,
  ShieldIcon,
  CircleHelpIcon,
  LogOutIcon,
  PaletteIcon,
  GlobeIcon,
  KeyIcon,
  SmartphoneIcon,
} from 'lucide-react-native';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const settingsGroups = [
  {
    title: 'الحساب',
    items: [
      { icon: UserIcon, label: 'الملف الشخصي', subtitle: 'الاسم، البريد الإلكتروني' },
      { icon: KeyIcon, label: 'كلمة المرور', subtitle: 'تغيير كلمة المرور' },
      { icon: ShieldIcon, label: 'المصادقة الثنائية', subtitle: '2FA · OAuth2', badge: 'مفعّل' },
    ],
  },
  {
    title: 'التفضيلات',
    items: [
      { icon: BellIcon, label: 'الإشعارات', subtitle: 'إشعارات الدفع والبريد' },
      { icon: PaletteIcon, label: 'المظهر', subtitle: 'الثيم الملكي السوري' },
      { icon: GlobeIcon, label: 'اللغة', subtitle: 'العربية' },
      { icon: SmartphoneIcon, label: 'الأجهزة', subtitle: 'إدارة الأجهزة المتصلة' },
    ],
  },
  {
    title: 'الدعم',
    items: [
      { icon: CircleHelpIcon, label: 'مركز المساعدة', subtitle: 'الأسئلة الشائعة والدعم' },
    ],
  },
];

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: IMPERIAL.background }}
      contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
        <Text style={{ fontSize: 22, fontWeight: '700', color: IMPERIAL.gold, textAlign: 'right' }}>
          الإعدادات
        </Text>
      </View>

      <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
        <View
          style={{
            backgroundColor: IMPERIAL.card,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: IMPERIAL.border,
            padding: 16,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <ChevronLeftIcon size={18} color={IMPERIAL.textTertiary} />
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: IMPERIAL.text }}>مستخدم سوريا AI</Text>
            <Text style={{ fontSize: 12, color: IMPERIAL.textTertiary }}>user@syria-ai.com</Text>
          </View>
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: IMPERIAL.accent,
              borderWidth: 1,
              borderColor: IMPERIAL.border,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <GoldenEagle size={30} />
          </View>
        </View>
      </View>

      {settingsGroups.map((group) => (
        <View key={group.title} style={{ paddingHorizontal: 16, marginBottom: 20 }}>
          <Text
            style={{
              fontSize: 13,
              fontWeight: '700',
              color: IMPERIAL.gold,
              textAlign: 'right',
              marginBottom: 8,
              paddingRight: 4,
            }}
          >
            {group.title}
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
            {group.items.map((item, index) => {
              const Icon = item.icon;
              return (
                <TouchableOpacity
                  key={item.label}
                  activeOpacity={0.7}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 14,
                    gap: 10,
                    borderBottomWidth: index < group.items.length - 1 ? 1 : 0,
                    borderBottomColor: IMPERIAL.border,
                  }}
                >
                  <ChevronLeftIcon size={16} color={IMPERIAL.textTertiary} />
                  {'badge' in item && item.badge && (
                    <View
                      style={{
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                        borderRadius: 6,
                        backgroundColor: 'rgba(74, 222, 128, 0.15)',
                      }}
                    >
                      <Text style={{ fontSize: 10, fontWeight: '600', color: IMPERIAL.success }}>
                        {item.badge}
                      </Text>
                    </View>
                  )}
                  <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 14, fontWeight: '500', color: IMPERIAL.text }}>{item.label}</Text>
                    <Text style={{ fontSize: 11, color: IMPERIAL.textTertiary, marginTop: 1 }}>
                      {item.subtitle}
                    </Text>
                  </View>
                  <Icon size={18} color={IMPERIAL.gold} />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ))}

      <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={{
            backgroundColor: IMPERIAL.card,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: 'rgba(239, 68, 68, 0.3)',
            padding: 14,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#EF4444' }}>تسجيل الخروج</Text>
          <LogOutIcon size={18} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <View style={{ alignItems: 'center', paddingVertical: 12 }}>
        <GoldenEagle size={24} />
        <Text style={{ fontSize: 11, color: IMPERIAL.textTertiary, marginTop: 4 }}>
          سوريا AI v1.0.0
        </Text>
      </View>
    </ScrollView>
  );
}
