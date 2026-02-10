import GoldenEagle from '@/components/icons/GoldenEagle';
import FileTree from '@/components/workbench/FileTree';
import { useWorkbenchStore, type BottomPanelType } from '@/lib/stores/workbench-store';
import { IMPERIAL } from '@/lib/theme';
import {
  XIcon,
  PanelLeftIcon,
  PanelBottomIcon,
  PlayIcon,
  TerminalIcon,
  AlertTriangleIcon,
  FileOutputIcon,
  BrainCircuitIcon,
  GlobeIcon,
  CopyIcon,
  SaveIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react-native';
import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Platform, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SCREEN_WIDTH = Dimensions.get('window').width;

const bottomTabs: { key: BottomPanelType; label: string; icon: typeof TerminalIcon }[] = [
  { key: 'terminal', label: 'Terminal', icon: TerminalIcon },
  { key: 'problems', label: 'مشاكل', icon: AlertTriangleIcon },
  { key: 'output', label: 'مخرجات', icon: FileOutputIcon },
  { key: 'agent', label: 'Agent', icon: BrainCircuitIcon },
];

const TERMINAL_LINES = [
  { type: 'prompt', text: '$ npm run dev' },
  { type: 'info', text: '  ▸ Starting development server...' },
  { type: 'success', text: '  ✓ Ready in 1.2s' },
  { type: 'info', text: '  ▸ Local:   http://localhost:3000' },
  { type: 'info', text: '  ▸ Network: http://192.168.1.5:3000' },
  { type: 'prompt', text: '$ ' },
];

function CodeEditor() {
  const { openTabs, activeTabId, closeTab, setActiveTab, updateTabContent } = useWorkbenchStore();
  const activeTab = openTabs.find((t) => t.id === activeTabId);

  if (openTabs.length === 0) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: IMPERIAL.editor.bg }}>
        <GoldenEagle size={48} />
        <Text style={{ fontSize: 14, color: IMPERIAL.textTertiary, marginTop: 12 }}>
          اختر ملفاً لبدء التحرير
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: IMPERIAL.editor.bg }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ maxHeight: 36, borderBottomWidth: 1, borderBottomColor: IMPERIAL.border }}
        contentContainerStyle={{ alignItems: 'center' }}
      >
        {openTabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => setActiveTab(tab.id)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              paddingHorizontal: 12,
              paddingVertical: 8,
              backgroundColor: tab.id === activeTabId ? IMPERIAL.panel.tabActiveBg : IMPERIAL.panel.tabBg,
              borderRightWidth: 1,
              borderRightColor: IMPERIAL.border,
            }}
          >
            <Text style={{ fontSize: 11, color: tab.id === activeTabId ? IMPERIAL.gold : IMPERIAL.textTertiary, fontWeight: tab.id === activeTabId ? '600' : '400' }}>
              {tab.name}
            </Text>
            {tab.isModified && <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: IMPERIAL.gold }} />}
            <TouchableOpacity onPress={() => closeTab(tab.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <XIcon size={10} color={IMPERIAL.textTertiary} />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {activeTab && (
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', paddingHorizontal: 8, paddingVertical: 4, gap: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(212,175,55,0.08)' }}>
            <Text style={{ fontSize: 10, color: IMPERIAL.textTertiary }}>
              {activeTab.language} • Ln {activeTab.cursorLine}, Col {activeTab.cursorCol}
            </Text>
            <TouchableOpacity style={{ padding: 4 }}>
              <CopyIcon size={12} color={IMPERIAL.textTertiary} />
            </TouchableOpacity>
            <TouchableOpacity style={{ padding: 4 }}>
              <SaveIcon size={12} color={activeTab.isModified ? IMPERIAL.gold : IMPERIAL.textTertiary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={{ flex: 1, padding: 12 }}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: 36, alignItems: 'flex-end', paddingRight: 8, borderRightWidth: 1, borderRightColor: 'rgba(212,175,55,0.1)' }}>
                {activeTab.content.split('\n').map((_, i) => (
                  <Text key={i} style={{ fontSize: 12, lineHeight: 20, color: IMPERIAL.editor.lineNumber, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' }}>
                    {i + 1}
                  </Text>
                ))}
              </View>
              <TextInput
                value={activeTab.content}
                onChangeText={(text) => updateTabContent(activeTab.id, text)}
                multiline
                scrollEnabled={false}
                style={{
                  flex: 1,
                  fontSize: 12,
                  lineHeight: 20,
                  color: IMPERIAL.editor.variable,
                  fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
                  paddingLeft: 8,
                  textAlignVertical: 'top',
                }}
              />
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
}

function TerminalPanel() {
  const [cmd, setCmd] = useState('');

  return (
    <View style={{ flex: 1, backgroundColor: IMPERIAL.terminal.bg }}>
      <ScrollView style={{ flex: 1, padding: 8 }}>
        {TERMINAL_LINES.map((line, i) => (
          <Text
            key={i}
            style={{
              fontSize: 12,
              lineHeight: 20,
              fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
              color:
                line.type === 'prompt' ? IMPERIAL.terminal.prompt :
                line.type === 'success' ? IMPERIAL.terminal.success :
                line.type === 'error' ? IMPERIAL.terminal.error :
                IMPERIAL.terminal.text,
            }}
          >
            {line.text}
          </Text>
        ))}
      </ScrollView>
      <View style={{ flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: IMPERIAL.border, paddingHorizontal: 8 }}>
        <Text style={{ fontSize: 12, color: IMPERIAL.terminal.prompt, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' }}>$ </Text>
        <TextInput
          value={cmd}
          onChangeText={setCmd}
          placeholder="أدخل أمراً..."
          placeholderTextColor={IMPERIAL.textTertiary}
          style={{
            flex: 1,
            fontSize: 12,
            color: IMPERIAL.terminal.text,
            fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
            paddingVertical: 8,
          }}
        />
      </View>
    </View>
  );
}

function ProblemsPanel() {
  return (
    <View style={{ flex: 1, backgroundColor: IMPERIAL.terminal.bg, padding: 12, alignItems: 'center', justifyContent: 'center' }}>
      <AlertTriangleIcon size={24} color={IMPERIAL.success} />
      <Text style={{ fontSize: 13, color: IMPERIAL.success, marginTop: 8, fontWeight: '600' }}>لا توجد مشاكل</Text>
    </View>
  );
}

function OutputPanel() {
  return (
    <View style={{ flex: 1, backgroundColor: IMPERIAL.terminal.bg, padding: 12 }}>
      <Text style={{ fontSize: 12, color: IMPERIAL.terminal.info, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' }}>
        [INFO] سوريا AI Workbench v1.0.0
      </Text>
      <Text style={{ fontSize: 12, color: IMPERIAL.terminal.success, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', marginTop: 4 }}>
        [OK] جميع الأنظمة تعمل بنجاح
      </Text>
    </View>
  );
}

function AgentPanel() {
  const stages = [
    { label: 'التخطيط', status: 'done', color: IMPERIAL.agent.planning },
    { label: 'البحث', status: 'done', color: IMPERIAL.agent.researching },
    { label: 'البرمجة', status: 'active', color: IMPERIAL.agent.coding },
    { label: 'الاختبار', status: 'pending', color: IMPERIAL.agent.testing },
    { label: 'المراجعة', status: 'pending', color: IMPERIAL.agent.reviewing },
    { label: 'التحسين', status: 'pending', color: IMPERIAL.agent.refining },
    { label: 'النشر', status: 'pending', color: IMPERIAL.agent.deploying },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: IMPERIAL.terminal.bg, padding: 12 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, alignItems: 'center' }}>
        {stages.map((s, i) => (
          <View
            key={i}
            style={{
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 8,
              backgroundColor: s.status === 'active' ? `${s.color}20` : 'transparent',
              borderWidth: 1,
              borderColor: s.status === 'active' ? s.color : s.status === 'done' ? IMPERIAL.success : IMPERIAL.border,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: s.status === 'done' ? IMPERIAL.success : s.status === 'active' ? s.color : IMPERIAL.textTertiary }} />
            <Text style={{ fontSize: 11, color: s.status === 'active' ? s.color : s.status === 'done' ? IMPERIAL.success : IMPERIAL.textTertiary, fontWeight: s.status === 'active' ? '700' : '400' }}>
              {s.label}
            </Text>
          </View>
        ))}
      </ScrollView>
      <View style={{ marginTop: 12, padding: 10, backgroundColor: `${IMPERIAL.agent.coding}10`, borderRadius: 8, borderWidth: 1, borderColor: `${IMPERIAL.agent.coding}30` }}>
        <Text style={{ fontSize: 12, color: IMPERIAL.agent.coding, fontWeight: '600' }}>جاري البرمجة...</Text>
        <Text style={{ fontSize: 11, color: IMPERIAL.textTertiary, marginTop: 4 }}>يتم الآن كتابة الكود وتطبيق التعديلات</Text>
      </View>
    </View>
  );
}

export default function WorkbenchScreen() {
  const insets = useSafeAreaInsets();
  const {
    showFileTree,
    showBottomPanel,
    bottomPanelType,
    showPreview,
    previewUrl,
    toggleFileTree,
    toggleBottomPanel,
    setBottomPanelType,
    togglePreview,
  } = useWorkbenchStore();

  const [fileTreeWidth] = useState(SCREEN_WIDTH > 600 ? 220 : 180);

  const renderBottomPanel = () => {
    switch (bottomPanelType) {
      case 'terminal': return <TerminalPanel />;
      case 'problems': return <ProblemsPanel />;
      case 'output': return <OutputPanel />;
      case 'agent': return <AgentPanel />;
      default: return <TerminalPanel />;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: IMPERIAL.background, paddingTop: insets.top }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 10,
          paddingVertical: 6,
          borderBottomWidth: 1,
          borderBottomColor: IMPERIAL.border,
          backgroundColor: IMPERIAL.panel.headerBg,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <TouchableOpacity onPress={toggleFileTree} style={{ padding: 4 }}>
            <PanelLeftIcon size={16} color={showFileTree ? IMPERIAL.gold : IMPERIAL.textTertiary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleBottomPanel} style={{ padding: 4 }}>
            <PanelBottomIcon size={16} color={showBottomPanel ? IMPERIAL.gold : IMPERIAL.textTertiary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={togglePreview} style={{ padding: 4 }}>
            <GlobeIcon size={16} color={showPreview ? IMPERIAL.gold : IMPERIAL.textTertiary} />
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: IMPERIAL.gold }}>Workbench</Text>
          <GoldenEagle size={22} />
        </View>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: IMPERIAL.accent, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, borderWidth: 1, borderColor: IMPERIAL.border }}>
          <PlayIcon size={12} color={IMPERIAL.success} fill={IMPERIAL.success} />
          <Text style={{ fontSize: 11, color: IMPERIAL.success, fontWeight: '600' }}>تشغيل</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1, flexDirection: 'row' }}>
        {showFileTree && (
          <View style={{ width: fileTreeWidth, borderRightWidth: 1, borderRightColor: IMPERIAL.border }}>
            <FileTree />
          </View>
        )}

        <View style={{ flex: 1 }}>
          <View style={{ flex: showBottomPanel ? 0.6 : 1 }}>
            {showPreview ? (
              <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: IMPERIAL.panel.headerBg, paddingHorizontal: 8, paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: IMPERIAL.border, gap: 6 }}>
                  <TouchableOpacity style={{ padding: 2 }}><ChevronLeftIcon size={14} color={IMPERIAL.textTertiary} /></TouchableOpacity>
                  <TouchableOpacity style={{ padding: 2 }}><ChevronRightIcon size={14} color={IMPERIAL.textTertiary} /></TouchableOpacity>
                  <View style={{ flex: 1, backgroundColor: IMPERIAL.card, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1, borderColor: IMPERIAL.border }}>
                    <Text style={{ fontSize: 10, color: IMPERIAL.textTertiary }} numberOfLines={1}>{previewUrl}</Text>
                  </View>
                </View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: IMPERIAL.editor.bg }}>
                  <GlobeIcon size={32} color={IMPERIAL.textTertiary} />
                  <Text style={{ fontSize: 13, color: IMPERIAL.textTertiary, marginTop: 8 }}>معاينة المشروع</Text>
                </View>
              </View>
            ) : (
              <CodeEditor />
            )}
          </View>

          {showBottomPanel && (
            <View style={{ flex: 0.4, borderTopWidth: 1, borderTopColor: IMPERIAL.border }}>
              <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: IMPERIAL.border, backgroundColor: IMPERIAL.panel.headerBg }}>
                {bottomTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = bottomPanelType === tab.key;
                  return (
                    <TouchableOpacity
                      key={tab.key}
                      onPress={() => setBottomPanelType(tab.key)}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 4,
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderBottomWidth: 2,
                        borderBottomColor: isActive ? IMPERIAL.gold : 'transparent',
                      }}
                    >
                      <Icon size={12} color={isActive ? IMPERIAL.gold : IMPERIAL.textTertiary} />
                      <Text style={{ fontSize: 10, color: isActive ? IMPERIAL.gold : IMPERIAL.textTertiary, fontWeight: isActive ? '600' : '400' }}>
                        {tab.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              {renderBottomPanel()}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
