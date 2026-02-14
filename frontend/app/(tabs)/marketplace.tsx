import { useMCPStore } from '@/lib/stores/mcp-store';
import { IMPERIAL } from '@/lib/theme';
import {
  StarIcon,
  DownloadIcon,
  TerminalIcon,
  GlobeIcon,
  BrainCircuitIcon,
  DatabaseIcon,
  ImageIcon,
  MailIcon,
  GitBranchIcon,
  MessageSquareIcon,
  SearchIcon,
  PlugIcon,
  WrenchIcon,
  LayoutTemplateIcon,
  RocketIcon,
  ShoppingCartIcon,
  CodeIcon,
  SmartphoneIcon,
  ServerIcon,
  CreditCardIcon,
} from 'lucide-react-native';
import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const tools = [
  {
    icon: BrainCircuitIcon,
    name: 'OpenAI Real-time',
    desc: 'اتصال حقيقي مع GPT-4 و DALL-E',
    rating: 4.9,
    downloads: '25K',
    cat: 'ai',
  },
  {
    icon: DatabaseIcon,
    name: 'Supabase DB',
    desc: 'إدارة قواعد بيانات Auth و Storage حقيقية',
    rating: 4.8,
    downloads: '18K',
    cat: 'dev',
  },
  {
    icon: CreditCardIcon,
    name: 'Stripe Payments',
    desc: 'بوابة مدفوعات واشتراكات حقيقية',
    rating: 4.9,
    downloads: '15K',
    cat: 'dev',
  },
  {
    icon: GitBranchIcon,
    name: 'GitHub Actions',
    desc: 'أتمتة النشر والمستودعات الحقيقية',
    rating: 4.7,
    downloads: '20K',
    cat: 'dev',
  },
  {
    icon: MessageSquareIcon,
    name: 'Slack Real-time',
    desc: 'إرسال رسائل وقنوات حقيقية',
    rating: 4.5,
    downloads: '10K',
    cat: 'comm',
  },
  {
    icon: MailIcon,
    name: 'Twilio SMS',
    desc: 'إرسال رسائل SMS ومكالمات حقيقية',
    rating: 4.4,
    downloads: '8K',
    cat: 'comm',
  },
];

const templates = [
  {
    icon: CodeIcon,
    name: 'SaaS Starter',
    desc: 'قالب SaaS كامل مع Auth + DB حقيقي',
    stack: 'Next.js · Supabase · Stripe',
  },
  {
    icon: SmartphoneIcon,
    name: 'Mobile App',
    desc: 'تطبيق موبايل حقيقي مع API',
    stack: 'React Native · Expo · Hono',
  },
  {
    icon: ShoppingCartIcon,
    name: 'E-Commerce',
    desc: 'متجر إلكتروني متكامل وحقيقي',
    stack: 'Next.js · Stripe · Supabase',
  },
  {
    icon: ServerIcon,
    name: 'API Server',
    desc: 'خادم API حقيقي مع Auth + Rate Limit',
    stack: 'Hono · Bun · PostgreSQL',
  },
  {
    icon: RocketIcon,
    name: 'Landing Page',
    desc: 'صفحة هبوط احترافية حقيقية',
    stack: 'Next.js · Tailwind · Framer Motion',
  },
  {
    icon: BrainCircuitIcon,
    name: 'AI Chatbot',
    desc: 'بوت ذكي حقيقي مع RAG',
    stack: 'LangChain · Supabase · OpenAI',
  },
];

const categories = [
  { key: 'all', label: 'الكل' },
  { key: 'dev', label: 'تطوير' },
  { key: 'ai', label: 'ذكاء اصطناعي' },
  { key: 'auto', label: 'أتمتة' },
  { key: 'comm', label: 'تواصل' },
];

type TabType = 'tools' | 'templates' | 'mcp';

export default function MarketplaceScreen() {
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('tools');
  const { connectors, toggleConnection } = useMCPStore();

  const filteredTools = tools.filter((t) => {
    const matchCat = activeCategory === 'all' || t.cat === activeCategory;
    const matchSearch =
      !searchQuery ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.desc.includes(searchQuery);
    return matchCat && matchSearch;
  });

  const tabs: { key: TabType; label: string; icon: typeof PlugIcon }[] = [
    { key: 'tools', label: 'الأدوات الحقيقية', icon: WrenchIcon },
    { key: 'templates', label: 'القوالب الجاهزة', icon: LayoutTemplateIcon },
    { key: 'mcp', label: 'بروتوكول MCP', icon: PlugIcon },
  ];

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: IMPERIAL.background }}
      contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}>
      <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
        <Text style={{ fontSize: 22, fontWeight: '700', color: IMPERIAL.gold, textAlign: 'right' }}>
          سوق التقنيات الحقيقية
        </Text>
        <Text
          style={{ fontSize: 13, color: IMPERIAL.textTertiary, textAlign: 'right', marginTop: 4 }}>
          أدوات، قوالب، وموصلات حقيقية وجاهزة للعمل
        </Text>
      </View>

      <View style={{ flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 12 }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                paddingVertical: 10,
                borderRadius: 12,
                backgroundColor: isActive ? IMPERIAL.primary : IMPERIAL.card,
                borderWidth: 1,
                borderColor: isActive ? IMPERIAL.gold : IMPERIAL.border,
              }}>
              <Icon
                size={14}
                color={isActive ? IMPERIAL.primaryForeground : IMPERIAL.textTertiary}
              />
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '600',
                  color: isActive ? IMPERIAL.primaryForeground : IMPERIAL.text,
                }}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
        <View
          style={{
            backgroundColor: IMPERIAL.card,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: IMPERIAL.border,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 12,
            gap: 8,
          }}>
          <SearchIcon size={18} color={IMPERIAL.textTertiary} />
          <TextInput
            placeholder={
              activeTab === 'mcp'
                ? 'ابحث عن موصل حقيقي...'
                : activeTab === 'templates'
                  ? 'ابحث عن قالب حقيقي...'
                  : 'ابحث عن أداة حقيقية...'
            }
            placeholderTextColor={IMPERIAL.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{
              flex: 1,
              fontSize: 14,
              color: IMPERIAL.text,
              paddingVertical: 12,
              textAlign: 'right',
              writingDirection: 'rtl',
            }}
          />
        </View>
      </View>

      {activeTab === 'tools' && (
        <>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 8, marginBottom: 12 }}
            style={{ marginBottom: 12 }}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.key}
                onPress={() => setActiveCategory(cat.key)}
                activeOpacity={0.7}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor: activeCategory === cat.key ? IMPERIAL.primary : IMPERIAL.card,
                  borderWidth: 1,
                  borderColor: activeCategory === cat.key ? IMPERIAL.gold : IMPERIAL.border,
                }}>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: '600',
                    color: activeCategory === cat.key ? IMPERIAL.primaryForeground : IMPERIAL.text,
                  }}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={{ paddingHorizontal: 16, gap: 10 }}>
            {filteredTools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <View
                  key={index}
                  style={{
                    backgroundColor: IMPERIAL.card,
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: IMPERIAL.border,
                    padding: 14,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                  }}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 8,
                      backgroundColor: IMPERIAL.accent,
                      borderWidth: 1,
                      borderColor: IMPERIAL.border,
                    }}>
                    <Text style={{ fontSize: 11, fontWeight: '600', color: IMPERIAL.gold }}>
                      تفعيل
                    </Text>
                  </TouchableOpacity>
                  <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: IMPERIAL.text }}>
                      {tool.name}
                    </Text>
                    <Text style={{ fontSize: 12, color: IMPERIAL.textTertiary, marginTop: 2 }}>
                      {tool.desc}
                    </Text>
                    <View
                      style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 6 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                        <Text style={{ fontSize: 11, color: IMPERIAL.textTertiary }}>
                          {tool.downloads}
                        </Text>
                        <DownloadIcon size={10} color={IMPERIAL.textTertiary} />
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                        <Text style={{ fontSize: 11, color: IMPERIAL.textTertiary }}>
                          {tool.rating}
                        </Text>
                        <StarIcon size={10} color={IMPERIAL.gold} />
                      </View>
                    </View>
                  </View>
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      backgroundColor: IMPERIAL.accent,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 1,
                      borderColor: IMPERIAL.border,
                    }}>
                    <Icon size={22} color={IMPERIAL.gold} />
                  </View>
                </View>
              );
            })}
          </View>
        </>
      )}

      {activeTab === 'templates' && (
        <View style={{ paddingHorizontal: 16, gap: 12 }}>
          {templates.map((template, index) => {
            const Icon = template.icon;
            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.8}
                style={{
                  backgroundColor: IMPERIAL.card,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: IMPERIAL.border,
                  overflow: 'hidden',
                }}>
                <View style={{ padding: 16 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 12,
                    }}>
                    <View
                      style={{
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        borderRadius: 6,
                        backgroundColor: IMPERIAL.accent,
                      }}>
                      <Text style={{ fontSize: 10, fontWeight: '700', color: IMPERIAL.gold }}>
                        حقيقي
                      </Text>
                    </View>
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        backgroundColor: IMPERIAL.accent,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Icon size={20} color={IMPERIAL.gold} />
                    </View>
                  </View>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '700',
                      color: IMPERIAL.text,
                      textAlign: 'right',
                    }}>
                    {template.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      color: IMPERIAL.textTertiary,
                      textAlign: 'right',
                      marginTop: 4,
                    }}>
                    {template.desc}
                  </Text>
                  <View
                    style={{
                      marginTop: 14,
                      paddingTop: 14,
                      borderTopWidth: 1,
                      borderTopColor: IMPERIAL.border,
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                    }}>
                    <Text style={{ fontSize: 11, color: IMPERIAL.gold, fontWeight: '600' }}>
                      {template.stack}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {activeTab === 'mcp' && (
        <View style={{ paddingHorizontal: 16, gap: 12 }}>
          {connectors.map((mcp) => (
            <View
              key={mcp.id}
              style={{
                backgroundColor: IMPERIAL.card,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: IMPERIAL.border,
                padding: 16,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity
                  onPress={() => toggleConnection(mcp.id)}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 7,
                    borderRadius: 10,
                    backgroundColor: mcp.connected ? IMPERIAL.accent : IMPERIAL.primary,
                    borderWidth: 1,
                    borderColor: mcp.connected ? IMPERIAL.gold : IMPERIAL.gold,
                  }}>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '700',
                      color: mcp.connected ? IMPERIAL.gold : IMPERIAL.primaryForeground,
                    }}>
                    {mcp.connected ? 'متصل' : 'اتصال'}
                  </Text>
                </TouchableOpacity>
                <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 12 }}>
                  <Text style={{ fontSize: 15, fontWeight: '700', color: IMPERIAL.text }}>
                    {mcp.name}
                  </Text>
                  <View
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                    <Text style={{ fontSize: 11, color: IMPERIAL.textTertiary }}>{mcp.type}</Text>
                    <View
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: mcp.connected ? '#4ade80' : '#ef4444',
                      }}
                    />
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
