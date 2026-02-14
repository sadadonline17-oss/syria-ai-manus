import { IMPERIAL } from '@/lib/theme';
import { View, Text, TouchableOpacity } from 'react-native';

const footerSections = [
  {
    title: 'نظام Manus AGI',
    links: ['محرك الوكلاء', 'الذاكرة طويلة الأمد', 'تصفح الويب الحي', 'تحليل البيانات الحقيقي', 'سير عمل Manus'],
  },
  {
    title: 'الموارد',
    links: ['التوثيق', 'مركز المساعدة', 'المدونة', 'سجل التحديثات', 'مرجع API'],
  },
  {
    title: 'المجتمع',
    links: ['Twitter / X', 'Discord', 'GitHub', 'Telegram'],
  },
  {
    title: 'الشركة',
    links: ['من نحن', 'الوظائف', 'الخصوصية', 'الشروط', 'تواصل معنا'],
  },
];

export default function Footer() {
  return (
    <View
      style={{
        backgroundColor: IMPERIAL.background,
        borderTopWidth: 1,
        borderTopColor: IMPERIAL.border,
        paddingVertical: 32,
        paddingHorizontal: 20,
        marginTop: 40,
      }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 20, marginBottom: 28 }}>
        {footerSections.map((section) => (
          <View key={section.title} style={{ width: '45%', marginBottom: 12 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '700',
                color: IMPERIAL.gold,
                marginBottom: 10,
                textAlign: 'right',
              }}>
              {section.title}
            </Text>
            {section.links.map((link) => (
              <TouchableOpacity key={link} activeOpacity={0.7} style={{ paddingVertical: 3 }}>
                <Text style={{ fontSize: 13, color: IMPERIAL.textSecondary, textAlign: 'right' }}>
                  {link}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      <View style={{ borderTopWidth: 1, borderTopColor: IMPERIAL.border, paddingTop: 20 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginBottom: 8,
          }}>
          <Text style={{ fontSize: 15, fontWeight: '700', color: IMPERIAL.gold, letterSpacing: 1 }}>
            سوريا AI
          </Text>
        </View>
        <Text style={{ fontSize: 11, color: IMPERIAL.textTertiary, textAlign: 'center' }}>
          الجمهورية العربية السورية — الهوية البصرية الجديدة — {new Date().getFullYear()} — مدعوم بقدرات Manus AGI
        </Text>
      </View>
    </View>
  );
}
