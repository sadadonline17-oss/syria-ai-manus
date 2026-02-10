import { IMPERIAL } from '@/lib/theme';
import {
  TerminalIcon,
  GlobeIcon,
  FolderIcon,
  GitBranchIcon,
  ShoppingCartIcon,
  BrainCircuitIcon,
  WorkflowIcon,
  PlugIcon,
  LayoutTemplateIcon,
  SearchIcon,
} from 'lucide-react-native';
import { View, Text, TouchableOpacity } from 'react-native';

const features = [
  { icon: TerminalIcon, title: 'مستكشف الأوامر', desc: 'تنفيذ أوامر Shell متقدمة مع مراقبة فورية' },
  { icon: GlobeIcon, title: 'أتمتة المتصفح', desc: 'تصفح وتفاعل تلقائي مع صفحات الويب' },
  { icon: FolderIcon, title: 'مدير الملفات', desc: 'إدارة ملفاتك ومشاريعك بذكاء وسرعة' },
  { icon: WorkflowIcon, title: 'مُصوّر سير العمل', desc: 'تصميم مسارات عمل بصرية Drag & Drop' },
  { icon: ShoppingCartIcon, title: 'سوق الأدوات', desc: 'تصفح وتثبيت إضافات وأدوات جاهزة' },
  { icon: GitBranchIcon, title: 'تكامل GitHub', desc: 'ربط مستودعاتك وإدارة الأكواد مباشرة' },
  { icon: PlugIcon, title: 'موصلات ذكية', desc: 'Slack · Stripe · Supabase · Twilio وأكثر' },
  { icon: BrainCircuitIcon, title: 'بروتوكول MCP', desc: 'تكامل كامل مع Model Context Protocol' },
  { icon: LayoutTemplateIcon, title: 'قوالب جاهزة', desc: 'مكتبة Prompt Templates للبدء السريع' },
  { icon: SearchIcon, title: 'بحث ذكي', desc: 'بحث عميق في الويب مع تحليل النتائج' },
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
              }}
            >
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
                }}
              >
                <Icon size={20} color={IMPERIAL.gold} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  numberOfLines={1}
                  style={{ fontSize: 14, fontWeight: '600', color: IMPERIAL.text, textAlign: 'right' }}
                >
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
                  }}
                >
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
