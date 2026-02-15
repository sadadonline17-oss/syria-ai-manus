import GoldenEagle from '@/components/icons/GoldenEagle';
import FileTree from '@/components/workbench/FileTree';
import CodeEditorAdvanced from '@/components/workbench/CodeEditorAdvanced';
import TerminalAdvanced from '@/components/workbench/TerminalAdvanced';
import PreviewAdvanced from '@/components/workbench/PreviewAdvanced';
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
import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SCREEN_WIDTH = Dimensions.get('window').width;

const bottomTabs: { key: BottomPanelType; label: string; icon: typeof TerminalIcon }[] = [
  { key: 'terminal', label: 'Terminal', icon: TerminalIcon },
  { key: 'problems', label: 'مشاكل', icon: AlertTriangleIcon },
  { key: 'output', label: 'مخرجات', icon: FileOutputIcon },
  { key: 'agent', label: 'Agent', icon: BrainCircuitIcon },
];

export default function WorkbenchScreen() {
  const insets = useSafeAreaInsets();
  const {
    showLeftPanel,
    showRightPanel,
    showBottomPanel,
    bottomPanelType,
    setShowLeftPanel,
    setShowRightPanel,
    setShowBottomPanel,
    setBottomPanelType,
    openTabs,
    activeTabId,
  } = useWorkbenchStore();

  const [splitRatio, setSplitRatio] = useState(0.6);
  const activeTab = openTabs.find((t) => t.id === activeTabId);

  const handleFormatCode = (code: string): string => {
    // Simple code formatting
    return code
      .split('\n')
      .map((line) => line.trimEnd())
      .join('\n');
  };

  const handleTerminalCommand = async (command: string): Promise<string> => {
    // Simulate command execution
    return new Promise((resolve) => {
      setTimeout(() => {
        if (command === 'npm run dev') {
          resolve('▸ Starting development server...\n✓ Ready in 1.2s');
        } else if (command === 'npm run build') {
          resolve('▸ Building project...\n✓ Build complete');
        } else {
          resolve(`تم تنفيذ: ${command}`);
        }
      }, 500);
    });
  };

  const renderBottomPanel = () => {
    switch (bottomPanelType) {
      case 'terminal':
        return <TerminalAdvanced onCommand={handleTerminalCommand} />;
      case 'problems':
        return (
          <View
            style={{
              flex: 1,
              backgroundColor: IMPERIAL.terminal.bg,
              padding: 12,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <AlertTriangleIcon size={24} color={IMPERIAL.success} />
            <Text style={{ fontSize: 13, color: IMPERIAL.success, marginTop: 8, fontWeight: '600' }}>
              لا توجد مشاكل
            </Text>
          </View>
        );
      case 'output':
        return (
          <View style={{ flex: 1, backgroundColor: IMPERIAL.terminal.bg, padding: 12 }}>
            <Text
              style={{
                fontSize: 12,
                color: IMPERIAL.terminal.info,
                fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
              }}>
              [INFO] سوريا AI Workbench v2.0.0
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: IMPERIAL.terminal.success,
                fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
                marginTop: 4,
              }}>
              [OK] جميع الأنظمة تعمل بنجاح
            </Text>
          </View>
        );
      case 'agent':
        return (
          <View style={{ flex: 1, backgroundColor: IMPERIAL.terminal.bg, padding: 12 }}>
            <Text
              style={{
                fontSize: 12,
                color: IMPERIAL.terminal.info,
                fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
              }}>
              🤖 وكيل سوريا AI جاهز للعمل
            </Text>
            <Text
              style={{
                fontSize: 11,
                color: IMPERIAL.terminal.success,
                marginTop: 8,
              }}>
              ✓ التخطيط • ✓ البحث • ▸ البرمجة • ○ الاختبار
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: IMPERIAL.editor.bg,
        paddingTop: insets.top,
      }}>
      {/* Header Toolbar */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderBottomWidth: 1,
          borderBottomColor: IMPERIAL.border,
          backgroundColor: IMPERIAL.panel.headerBg,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <GoldenEagle size={20} />
          <Text style={{ fontSize: 12, color: IMPERIAL.gold, fontWeight: '600' }}>
            سوريا AI Workbench
          </Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <TouchableOpacity
            onPress={() => setShowLeftPanel(!showLeftPanel)}
            style={{
              padding: 6,
              borderRadius: 4,
              backgroundColor: showLeftPanel
                ? 'rgba(212,175,55,0.2)'
                : 'rgba(212,175,55,0.05)',
            }}>
            <PanelLeftIcon
              size={12}
              color={showLeftPanel ? IMPERIAL.gold : IMPERIAL.textTertiary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowRightPanel(!showRightPanel)}
            style={{
              padding: 6,
              borderRadius: 4,
              backgroundColor: showRightPanel
                ? 'rgba(212,175,55,0.2)'
                : 'rgba(212,175,55,0.05)',
            }}>
            <GlobeIcon
              size={12}
              color={showRightPanel ? IMPERIAL.gold : IMPERIAL.textTertiary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowBottomPanel(!showBottomPanel)}
            style={{
              padding: 6,
              borderRadius: 4,
              backgroundColor: showBottomPanel
                ? 'rgba(212,175,55,0.2)'
                : 'rgba(212,175,55,0.05)',
            }}>
            <PanelBottomIcon
              size={12}
              color={showBottomPanel ? IMPERIAL.gold : IMPERIAL.textTertiary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content Area */}
      <View style={{ flex: 1, flexDirection: 'row' }}>
        {/* Left Panel - File Tree */}
        {showLeftPanel && (
          <View
            style={{
              width: 200,
              borderRightWidth: 1,
              borderRightColor: IMPERIAL.border,
              backgroundColor: 'rgba(0,0,0,0.1)',
            }}>
            <FileTree />
          </View>
        )}

        {/* Center Area - Editor and Preview */}
        <View style={{ flex: 1, flexDirection: 'row' }}>
          {/* Editor */}
          <View style={{ flex: splitRatio }}>
            <CodeEditorAdvanced
              onCodeChange={(code) => {
                // Handle code changes
              }}
              onSave={(code) => {
                // Handle save
              }}
              onFormat={handleFormatCode}
            />
          </View>

          {/* Preview */}
          {showRightPanel && (
            <View
              style={{
                flex: 1 - splitRatio,
                borderLeftWidth: 1,
                borderLeftColor: IMPERIAL.border,
              }}>
              <PreviewAdvanced
                code={activeTab?.content}
                language={activeTab?.language}
                autoRefresh={true}
              />
            </View>
          )}
        </View>
      </View>

      {/* Bottom Panel */}
      {showBottomPanel && (
        <View style={{ flex: 0.35, borderTopWidth: 1, borderTopColor: IMPERIAL.border }}>
          <View
            style={{
              flexDirection: 'row',
              borderBottomWidth: 1,
              borderBottomColor: IMPERIAL.border,
              backgroundColor: IMPERIAL.panel.headerBg,
            }}>
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
                  }}>
                  <Icon size={12} color={isActive ? IMPERIAL.gold : IMPERIAL.textTertiary} />
                  <Text
                    style={{
                      fontSize: 10,
                      color: isActive ? IMPERIAL.gold : IMPERIAL.textTertiary,
                      fontWeight: isActive ? '600' : '400',
                    }}>
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
  );
}
