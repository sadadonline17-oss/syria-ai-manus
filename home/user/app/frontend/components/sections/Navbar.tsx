import GoldenEagle from '@/components/icons/GoldenEagle';
import { IMPERIAL } from '@/lib/theme';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Navbar() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: insets.top,
        backgroundColor: IMPERIAL.glass,
        borderBottomWidth: 1,
        borderBottomColor: IMPERIAL.border,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingVertical: 8,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <GoldenEagle size={36} />
          <View>
            <Text style={{ fontSize: 16, fontWeight: '700', color: IMPERIAL.gold, letterSpacing: 1 }}>
              سوريا AI
            </Text>
            <Text style={{ fontSize: 9, color: IMPERIAL.textTertiary, letterSpacing: 0.5 }}>
              الجمهورية العربية السورية
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              backgroundColor: IMPERIAL.primary,
              height: 34,
              paddingHorizontal: 14,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 13, fontWeight: '600', color: IMPERIAL.primaryForeground }}>
              تسجيل الدخول
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              height: 34,
              paddingHorizontal: 14,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: IMPERIAL.border,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 13, fontWeight: '500', color: IMPERIAL.text }}>حساب جديد</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
