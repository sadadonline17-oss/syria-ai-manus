import { IMPERIAL } from '@/lib/theme';
import {
  TerminalIcon,
  GlobeIcon,
  FolderIcon,
  GitBranchIcon,
  BrainCircuitIcon,
  WorkflowIcon,
  PlugIcon,
  LayoutTemplateIcon,
  SearchIcon,
} from 'lucide-react-native';
import { View, Text, TouchableOpacity } from 'react-native';

const features = [
  {
    icon: BrainCircuitIcon,
    title: 'محرك Manus AGI',
    desc: 'ذكاء اصطناعي عام قادر على التفكير والتنفيذ الذاتي',
  },
  {
    icon: WorkflowIcon,
    title: 'نظام الوكلاء (Agents)',
    desc: 'توزيع المهام على وكلاء متخصصين لضمان الدقة',
  },
  {
    icon: TerminalIcon,
    title: 'أدوات Manus الحقيقية',
    desc: 'وصول كامل لبيئة التشغيل، الملفات، والأوامر',
  },
  { icon: GlobeIcon, title: 'تصفح الويب الذكي', desc: 'بحث عميق وتحليل حي للمعلومات عبر الإنترنت' },
  {
    icon: FolderIcon,
    title: 'الذاكرة طويلة الأمد',
    desc: 'تذكر سياقك وتفضيلاتك عبر جميع المحادثات',
  },
  {
    icon: GitBranchIcon,
    title: 'سير العمل (Workflow)',
    desc: 'إدارة مهام برمجية معقدة من التخطيط إلى النشر',
  },
  {
    icon: SearchIcon,
    title: 'تحليل البيانات الحقيقي',
    desc: 'معالجة البيانات والملفات باستخدام أدوات متقدمة',
  },
  { icon: PlugIcon, title: 'تكاملات Manus', desc: 'ربط مباشر مع GitHub، Slack، وقواعد البيانات' },
  {
    icon: BrainCircuitIcon,
    title: 'بروتوكول MCP النشط',
    desc: 'تبادل السياق المتقدم بين النماذج والأدوات',
  },
  {
    icon: LayoutTemplateIcon,
    title: 'الهوية السورية الجديدة',
    desc: 'تصميم عصري يعكس روح الابتكار السوري',
  },
];

export default function FeatureGrid() {
  return (
    <View style={{ marginTop: 40, paddingHorizontal: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <Text style={{ fontSize: 20, fontWeight: '700', color: IMPERIAL.gold }}>
          18+ أداة متقدمة
        </Text>
      </View>
      <Text style={{ fontSize: 13, color: IMPERIAL.textTertiary, marginBottom: 16 }}>
        أدوات تنفيذية ذكية لإنجاز أي مهمة
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
