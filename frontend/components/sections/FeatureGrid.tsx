import { IMPERIAL } from '@/lib/theme';
import {
  TerminalIcon,
  GlobeIcon,
  DatabaseIcon,
  CreditCardIcon,
  CodeIcon,
  SmartphoneIcon,
  LayoutIcon,
  MessageSquareIcon,
  ZapIcon,
  ShieldCheckIcon,
} from 'lucide-react-native';
import { View, Text, TouchableOpacity } from 'react-native';

const features = [
  {
    icon: LayoutIcon,
    title: 'تطبيقات Next.js حقيقية',
    desc: 'بناء تطبيقات ويب متكاملة باستخدام Next.js و Tailwind CSS',
  },
  {
    icon: DatabaseIcon,
    title: 'تكامل Supabase الكامل',
    desc: 'قواعد بيانات حقيقية، مصادقة مستخدمين، وتخزين ملفات',
  },
  {
    icon: CreditCardIcon,
    title: 'مدفوعات Stripe حقيقية',
    desc: 'إعداد اشتراكات ومدفوعات Stripe للمتاجر الإلكترونية',
  },
  {
    icon: SmartphoneIcon,
    title: 'تطبيقات React Native',
    desc: 'تطوير تطبيقات موبايل حقيقية باستخدام Expo و Hono',
  },
  {
    icon: CodeIcon,
    title: 'خوادم API حقيقية',
    desc: 'بناء خوادم API سريعة باستخدام Hono و Bun و PostgreSQL',
  },
  {
    icon: MessageSquareIcon,
    title: 'بوتات AI حقيقية',
    desc: 'تطوير بوتات محادثة ذكية باستخدام LangChain و OpenAI',
  },
  {
    icon: ZapIcon,
    title: 'أداء فائق السرعة',
    desc: 'تحسين الأداء باستخدام أحدث التقنيات البرمجية الحقيقية',
  },
  {
    icon: ShieldCheckIcon,
    title: 'أمان وحماية حقيقية',
    desc: 'تطبيق معايير الأمان والمصادقة في جميع المشاريع',
  },
];

export default function FeatureGrid() {
  return (
    <View style={{ marginTop: 40, paddingHorizontal: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <Text style={{ fontSize: 20, fontWeight: '700', color: IMPERIAL.gold }}>
          تقنيات حقيقية متكاملة
        </Text>
      </View>
      <Text style={{ fontSize: 13, color: IMPERIAL.textTertiary, marginBottom: 16 }}>
        نحن لا نقدم محاكاة، بل نبني لك مشاريع جاهزة للنشر والعمل
      </Text>

      <View style={{ gap: 10 }}>
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.7}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderRadius: 14,
                borderWidth: 1,
                borderColor: IMPERIAL.border,
                backgroundColor: IMPERIAL.card,
                padding: 14,
                gap: 12,
              }}>
              <View
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  backgroundColor: IMPERIAL.accent,
                  borderWidth: 1,
                  borderColor: IMPERIAL.border,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Icon size={20} color={IMPERIAL.gold} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: IMPERIAL.text,
                    textAlign: 'right',
                  }}>
                  {feature.title}
                </Text>
                <Text
                  numberOfLines={2}
                  style={{
                    marginTop: 2,
                    fontSize: 12,
                    lineHeight: 18,
                    color: IMPERIAL.textTertiary,
                    textAlign: 'right',
                  }}>
                  {feature.desc}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
