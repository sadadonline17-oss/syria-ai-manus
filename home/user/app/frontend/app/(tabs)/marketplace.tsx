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
  ActivityIcon,
  WrenchIcon,
  LayoutTemplateIcon,
  RocketIcon,
  ShoppingCartIcon,
  CodeIcon,
  SmartphoneIcon,
  ServerIcon,
} from 'lucide-react-native';
import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const tools = [
  { icon: TerminalIcon, name: 'Shell Explorer', desc: 'تنفيذ أوامر متقدمة', rating: 4.8, downloads: '12K', cat: 'dev' },
  { icon: GlobeIcon, name: 'Browser Auto', desc: 'أتمتة المتصفح', rating: 4.6, downloads: '8.5K', cat: 'auto' },
  { icon: BrainCircuitIcon, name: 'OpenAI Connector', desc: 'ربط مع GPT-4', rating: 4.9, downloads: '25K', cat: 'ai' },
  { icon: DatabaseIcon, name: 'Supabase Manager', desc: 'إدارة قاعدة البيانات', rating: 4.7, downloads: '15K', cat: 'dev' },
  { icon: ImageIcon, name: 'Image Generator', desc: 'توليد الصور بالذكاء', rating: 4.5, downloads: '18K', cat: 'ai' },
  { icon: MailIcon, name: 'Twilio SMS', desc: 'إرسال رسائل نصية', rating: 4.3, downloads: '6K', cat: 'comm' },
  { icon: GitBranchIcon, name: 'GitHub Sync', desc: 'مزامنة المستودعات', rating: 4.8, downloads: '20K', cat: 'dev' },
  { icon: MessageSquareIcon, name: 'Slack Bot', desc: 'ربط مع Slack', rating: 4.4, downloads: '9K', cat: 'comm' },
];

const templates = [
  { icon: CodeIcon, name: 'SaaS Starter', desc: 'قالب SaaS كامل مع Auth + DB', stack: 'Next.js · Supabase · Stripe' },
  { icon: SmartphoneIcon, name: 'Mobile App', desc: 'تطبيق موبايل مع API', stack: 'React Native · Expo · Hono' },
  { icon: ShoppingCartIcon, name: 'E-Commerce', desc: 'متجر إلكتروني متكامل', stack: 'Next.js · Stripe · Supabase' },
  { icon: ServerIcon, name: 'API Server', desc: 'خادم API مع Auth + Rate Limit', stack: 'Hono · Bun · PostgreSQL' },
  { icon: RocketIcon, name: 'Landing Page', desc: 'صفحة هبوط احترافية', stack: 'Next.js · Tailwind · Framer Motion' },
  { icon: BrainCircuitIcon, name: 'AI Chatbot', desc: 'بوت ذكي مع RAG', stack: 'LangChain · Supabase · OpenAI' },
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
    const matchSearch = !searchQuery || t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.desc.includes(searchQuery);
    return matchCat && matchSearch;
  });

  const tabs: { key: TabType; label: string; icon: typeof PlugIcon }[] = [
    { key: 'tools', label: 'الأدوات', icon: WrenchIcon },
    { key: 'templates', label: 'القوالب', icon: LayoutTemplateIcon },
    { key: 'mcp', label: 'MCP', icon: PlugIcon },
  ];

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: IMPERIAL.background }}
      contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
        <Text style={{ fontSize: 22, fontWeight: '700', color: IMPERIAL.gold, textAlign: 'right' }}>
          السوق
        </Text>
        <Text style={{ fontSize: 13, color: IMPERIAL.textTertiary, textAlign: 'right', marginTop: 4 }}>
          أدوات، قوالب، وموصلات MCP
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
              }}
            >
              <Icon size={14} color={isActive ? IMPERIAL.primaryForeground : IMPERIAL.textTertiary} />
              <Text style={{ fontSize: 12, fontWeight: '600', color: isActive ? IMPERIAL.primaryForeground : IMPERIAL.text }}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
        <View style={{ backgroundColor: IMPERIAL.card, borderRadius: 12, borderWidth: 1, borderColor: IMPERIAL.border, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, gap: 8 }}>
          <SearchIcon size={18} color={IMPERIAL.textTertiary} />
          <TextInput
            placeholder={activeTab === 'mcp' ? 'ابحث عن موصل...' : activeTab === 'templates' ? 'ابحث عن قالب...' : 'ابحث عن أداة...'}
            placeholderTextColor={IMPERIAL.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{ flex: 1, fontSize: 14, color: IMPERIAL.text, paddingVertical: 12, textAlign: 'right', writingDirection: 'rtl' }}
          />
        </View>
      </View>

      {activeTab === 'tools' && (
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 8, marginBottom: 12 }} style={{ marginBottom: 12 }}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.key}
                onPress={() => setActiveCategory(cat.key)}
                activeOpacity={0.7}
                style={{
                  paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
                  backgroundColor: activeCategory === cat.key ? IMPERIAL.primary : IMPERIAL.card,
                  borderWidth: 1, borderColor: activeCategory === cat.key ? IMPERIAL.gold : IMPERIAL.border,
                }}
              >
                <Text style={{ fontSize: 13, fontWeight: '600', color: activeCategory === cat.key ? IMPERIAL.primaryForeground : IMPERIAL.text }}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={{ paddingHorizontal: 16, gap: 10 }}>
            {filteredTools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <View key={index} style={{ backgroundColor: IMPERIAL.card, borderRadius: 14, borderWidth: 1, borderColor: IMPERIAL.border, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <TouchableOpacity activeOpacity={0.7} style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: IMPERIAL.accent, borderWidth: 1, borderColor: IMPERIAL.border }}>
                    <Text style={{ fontSize: 11, fontWeight: '600', color: IMPERIAL.gold }}>تثبيت</Text>
                  </TouchableOpacity>
                  <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: IMPERIAL.text }}>{tool.name}</Text>
                    <Text style={{ fontSize: 12, color: IMPERIAL.textTertiary, marginTop: 2 }}>{tool.desc}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 6 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                        <Text style={{ fontSize: 11, color: IMPERIAL.textTertiary }}>{tool.downloads}</Text>
                        <DownloadIcon size={12} color={IMPERIAL.textTertiary} />
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                        <Text style={{ fontSize: 11, color: IMPERIAL.gold }}>{tool.rating}</Text>
                        <StarIcon size={12} color={IMPERIAL.gold} fill={IMPERIAL.gold} />
                      </View>
                    </View>
                  </View>
                  <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: IMPERIAL.accent, borderWidth: 1, borderColor: IMPERIAL.border, alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={22} color={IMPERIAL.gold} />
                  </View>
                </View>
              );
            })}
          </View>
        </>
      )}

      {activeTab === 'templates' && (
        <View style={{ paddingHorizontal: 16, gap: 10 }}>
          {templates.map((tmpl, index) => {
            const Icon = tmpl.icon;
            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.7}
                style={{ backgroundColor: IMPERIAL.card, borderRadius: 14, borderWidth: 1, borderColor: IMPERIAL.border, padding: 16 }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: IMPERIAL.accent, borderWidth: 1, borderColor: IMPERIAL.border, alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={24} color={IMPERIAL.gold} />
                  </View>
                  <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: IMPERIAL.text }}>{tmpl.name}</Text>
                    <Text style={{ fontSize: 12, color: IMPERIAL.textTertiary, marginTop: 2 }}>{tmpl.desc}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: IMPERIAL.border }}>
                  <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: IMPERIAL.primary, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 8 }}>
                    <Text style={{ fontSize: 11, fontWeight: '600', color: IMPERIAL.primaryForeground }}>استخدام</Text>
                    <RocketIcon size={12} color={IMPERIAL.primaryForeground} />
                  </TouchableOpacity>
                  <Text style={{ fontSize: 10, color: IMPERIAL.textSecondary }}>{tmpl.stack}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {activeTab === 'mcp' && (
        <View style={{ paddingHorizontal: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: IMPERIAL.mcp.connected }} />
              <Text style={{ fontSize: 11, color: IMPERIAL.success }}>{connectors.filter((c) => c.status === 'connected').length} متصل</Text>
            </View>
            <Text style={{ fontSize: 15, fontWeight: '700', color: IMPERIAL.gold }}>موصلات MCP</Text>
          </View>

          <View style={{ gap: 8 }}>
            {connectors.map((connector) => (
              <View
                key={connector.id}
                style={{
                  backgroundColor: IMPERIAL.card,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: connector.status === 'connected' ? `${IMPERIAL.mcp.connected}40` : IMPERIAL.border,
                  padding: 14,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <TouchableOpacity
                    onPress={() => toggleConnection(connector.id)}
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 8,
                      backgroundColor: connector.status === 'connected' ? 'rgba(239,68,68,0.1)' : connector.status === 'pending' ? 'rgba(251,191,36,0.1)' : 'rgba(74,222,128,0.1)',
                      borderWidth: 1,
                      borderColor: connector.status === 'connected' ? 'rgba(239,68,68,0.3)' : connector.status === 'pending' ? 'rgba(251,191,36,0.3)' : 'rgba(74,222,128,0.3)',
                    }}
                  >
                    <Text style={{
                      fontSize: 10,
                      fontWeight: '600',
                      color: connector.status === 'connected' ? IMPERIAL.error : connector.status === 'pending' ? IMPERIAL.warning : IMPERIAL.success,
                    }}>
                      {connector.status === 'connected' ? 'قطع' : connector.status === 'pending' ? 'جاري...' : 'اتصال'}
                    </Text>
                  </TouchableOpacity>

                  <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <View style={{
                        width: 6, height: 6, borderRadius: 3,
                        backgroundColor: connector.status === 'connected' ? IMPERIAL.mcp.connected : connector.status === 'pending' ? IMPERIAL.mcp.pending : IMPERIAL.mcp.disconnected,
                      }} />
                      <Text style={{ fontSize: 14, fontWeight: '600', color: IMPERIAL.text }}>{connector.name}</Text>
                    </View>
                    <Text style={{ fontSize: 11, color: IMPERIAL.textTertiary, marginTop: 2 }}>{connector.description}</Text>
                  </View>

                  <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: IMPERIAL.accent, borderWidth: 1, borderColor: IMPERIAL.border, alignItems: 'center', justifyContent: 'center' }}>
                    <PlugIcon size={16} color={connector.status === 'connected' ? IMPERIAL.mcp.connected : IMPERIAL.textTertiary} />
                  </View>
                </View>

                {connector.status === 'connected' && (
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: IMPERIAL.border }}>
                    {connector.capabilities.map((cap) => (
                      <View key={cap} style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, backgroundColor: 'rgba(212,175,55,0.08)', borderWidth: 1, borderColor: 'rgba(212,175,55,0.15)' }}>
                        <Text style={{ fontSize: 9, color: IMPERIAL.textSecondary }}>{cap}</Text>
                      </View>
                    ))}
                    <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, backgroundColor: 'rgba(167,139,250,0.1)' }}>
                      <Text style={{ fontSize: 9, color: IMPERIAL.mcp.transport }}>{connector.transport.toUpperCase()}</Text>
                    </View>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}
